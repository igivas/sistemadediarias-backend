import { injectable, inject } from 'tsyringe';
import { addDays } from 'date-fns';
import { validate } from 'uuid';
import { getConnection } from 'typeorm';
import IUsuariosSegRepository from '@modules/public/repositories/interfaces/IUsuariosRepository';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import AppError from '../../../errors/AppError';
import IAssinaturasRepository from '../repositories/interfaces/IAssinaturasRepository';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';
import ILinksRepository from '../repositories/interfaces/ILinksRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';
import Assinatura from '../entities/Assinatura';

import Link from '../entities/Link';
import LinkUtilizado from '../entities/LinkUtilizado';
import AssinaturaRevogada from '../entities/AssinaturaRevogada';

@injectable()
class CreateAssinaturaService {
  constructor(
    @inject('AssinaturasRepository')
    private assinaturasRepository: IAssinaturasRepository,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,

    @inject('LinksRepository')
    private linksRepository: ILinksRepository,

    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasPmsRepository: IPessoasFisicasPmsRepository,

    @inject('UsuariosSegRepository')
    private usuariosRepository: IUsuariosSegRepository,
  ) {}

  async execute(token: string, novaAssinatura: string): Promise<Assinatura> {
    if (!validate(token)) {
      throw new AppError('Token inválido!');
    }

    const link = await this.linksRepository.findLinkValidoByToken(token);

    if (!link) {
      throw new AppError('O link é inexistente ou não é mais válido');
    }

    const validacao = await this.validacoesRepository.findById(
      link.id_validacao,
    );

    if (!validacao) {
      throw new AppError('Não existe email validado para o usuário');
    }

    const assinaturasAnteriores = await this.assinaturasRepository.findAssinaturasUtimos365diasByCpf(
      validacao.cpf,
    );

    if (assinaturasAnteriores) {
      const promises = assinaturasAnteriores.map(assinatura => {
        return this.hashProvider.compareHash(
          novaAssinatura,
          assinatura.hash_assinatura,
        );
      });
      let result;
      try {
        result = await Promise.all(promises);
      } catch (error) {
        throw new AppError('Ocorreu um erro no servidor!');
      }
      if (result.includes(true)) {
        throw new AppError(
          'A assinatura não deve ser a mesma dos últimos 365 dias!',
        );
      }
    }

    const hash_assinatura = await this.hashProvider.generateHash(
      novaAssinatura,
    );

    const validade_assinatura = addDays(new Date(), 90);

    const assinaturaAnterior = await this.assinaturasRepository.findAssinaturaByCpf(
      validacao.cpf,
    );

    if (validacao.militar) {
      const policial = await this.pessoasPmsRepository.findByCpf(validacao.cpf);

      if (!policial) {
        throw new AppError('Policial não foi encontrado para este cpf!');
      }
    } else {
      const civil = await this.usuariosRepository.findByCpf(validacao.cpf);
      if (!civil) {
        throw new AppError('Não existe pessoa para o CPF informado!');
      }
    }

    let assinatura = {} as Assinatura;

    const criarAssinaturaTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (assinaturaAnterior) {
          const linkutilizado = queryRunner.manager.create(LinkUtilizado, {
            id_validacao: link.id_validacao,
            cpf: link.cpf,
            token: link.token,
            validade_token: link.validade_token,
            criado_por: link.criado_por,
            criado_em: new Date(),
          });
          await queryRunner.manager.save(linkutilizado);
          await queryRunner.manager.delete(Link, link.id_link);
          const novaAssinaturaRevogada = queryRunner.manager.create(
            AssinaturaRevogada,
            {
              cpf: assinaturaAnterior.cpf,
              pes_codigo: assinaturaAnterior.pes_codigo,
              hash_assinatura: assinaturaAnterior.hash_assinatura,
              hash_pin: assinaturaAnterior.hash_pin,
              id_link_utilizado: assinaturaAnterior.id_link_utilizado,
              id_validacao: assinaturaAnterior.id_validacao,
              validade_assinatura: assinaturaAnterior.validade_assinatura,
              validade_pin: assinaturaAnterior.validade_pin,
            },
          );
          await queryRunner.manager.save(novaAssinaturaRevogada);
          assinatura = queryRunner.manager.merge(
            Assinatura,
            assinaturaAnterior,
            {
              hash_assinatura,
              validade_assinatura,
              id_link_utilizado: linkutilizado.id_link_utilizado,
            },
          );
          await queryRunner.manager.save(assinatura);
        } else {
          const linkutilizado = queryRunner.manager.create(LinkUtilizado, {
            id_validacao: link.id_validacao,
            cpf: link.cpf,
            token: link.token,
            validade_token: link.validade_token,
            criado_por: link.criado_por,
            criado_em: new Date(),
          });
          await queryRunner.manager.save(linkutilizado);
          await queryRunner.manager.delete(Link, link.id_link);

          assinatura = queryRunner.manager.create(Assinatura, {
            id_link_utilizado: linkutilizado.id_link_utilizado,
            id_validacao: link.id_validacao,
            hash_assinatura,
            validade_assinatura,
            cpf: validacao.cpf,
            pes_codigo: validacao.pes_codigo,
          });
          await queryRunner.manager.save(assinatura);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new AppError(`Ocorreu um erro ao tentar criar a assinatura!`);
      } finally {
        await queryRunner.release();
      }
    };

    await criarAssinaturaTransaction();

    return assinatura;
  }
}

export default CreateAssinaturaService;
