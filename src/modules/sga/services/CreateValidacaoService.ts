import { injectable, inject } from 'tsyringe';

import IUsuariosSegRepository from '@modules/public/repositories/interfaces/IUsuariosRepository';
import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';
import Usuario from '@modules/public/entities/Usuario';
import { getConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';
import IPessoasFisicasPmsRepository from '../../public/repositories/interfaces/IPessoasFisicasPmsRepository';
import Validacao from '../entities/Validacao';
import Queue from '../../../lib/Queue';

interface IRequest {
  email: string;
  pes_codigo: string;
  militar: boolean;
  criado_por: string;
  atualizado_por: string;
}

@injectable()
class CreateValidacoesService {
  constructor(
    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasPmsRepository: IPessoasFisicasPmsRepository,

    @inject('UsuariosSegRepository')
    private usuariosRepository: IUsuariosSegRepository,
  ) {}

  async execute({
    email,
    pes_codigo,
    militar,
    atualizado_por,
    criado_por,
  }: IRequest): Promise<any> {
    let policial = {} as PessoaFisicaPm | undefined;
    let civil = {} as Usuario | undefined;
    let validacaoPendente = {} as Validacao | undefined;
    let validacaoAtual = {} as Validacao | undefined;
    let novaValidacao = {} as Validacao;
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    if (militar) {
      policial = await this.pessoasPmsRepository.findByPesCodigo(pes_codigo);
      if (!policial) {
        throw new AppError('Não existe policial para o cpf informado!');
      }

      if (policial.pm_cpf.length !== 11) {
        throw new AppError(
          'O policial não possui cpf válido! Procurar sargenteante.',
        );
      }
      const pessoaemail = await this.pessoasPmsRepository.findEmailByPesCodigoAndEmail(
        policial.pm_codigo,
        email,
      );
      if (!pessoaemail) {
        throw new AppError('O email não existe para a pessoa informada!');
      }

      validacaoPendente = await this.validacoesRepository.findPendenteByCpf(
        policial.pm_cpf,
      );

      if (validacaoPendente) {
        throw new AppError(
          'Existe uma validação pendente! Encerre a pendência primeiro!',
        );
      }

      validacaoAtual = await this.validacoesRepository.findValidacaoAtualByCpf(
        policial.pm_cpf,
      );

      const criarValidacaoTransaction = async (): Promise<void> => {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          novaValidacao = queryRunner.manager.create(Validacao, {
            pes_codigo,
            cpf: policial?.pm_cpf,
            militar: true,
            email,
            codigo_validacao: codigo,
            atualizado_por,
            criado_por,
          });

          await queryRunner.manager.save(novaValidacao);

          await Queue.add('SendEmailCodigoValidacao', {
            email,
            codigo_validacao: codigo,
          });

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
          console.log(error);
          throw new AppError(`Ocorreu um erro ao tentar iniciar a validacão!`);
        } finally {
          await queryRunner.release();
        }
      };

      await criarValidacaoTransaction();
    } else {
      civil = await this.usuariosRepository.findByCpf(pes_codigo);
      if (!civil) {
        throw new AppError('Não existe pessoa com o cpf informado!');
      }

      const pessoaemail = await this.usuariosRepository.findEmailByUsoCodigoAndEmail(
        civil.usu_codigo,
        email,
      );
      if (!pessoaemail) {
        throw new AppError('O email não existe para a pessoa informada!');
      }
      validacaoPendente = await this.validacoesRepository.findPendenteByCpf(
        civil.usu_codigo,
      );
      if (validacaoPendente) {
        throw new AppError(
          'Existe uma validação pendente! Encerre a pendência primeiro!',
        );
      }
      validacaoAtual = await this.validacoesRepository.findValidacaoAtualByCpf(
        civil.usu_codigo,
      );
      novaValidacao = await this.validacoesRepository.create({
        cpf: civil.usu_codigo,
        militar: false,
        email,
        codigo_validacao: codigo,
        atualizado_por,
        criado_por,
      });
    }

    if (validacaoAtual?.email === email) {
      throw new AppError('O email já foi validado!');
    }

    return novaValidacao;
  }
}

export default CreateValidacoesService;
