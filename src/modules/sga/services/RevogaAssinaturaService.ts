import { injectable, inject } from 'tsyringe';
import { getConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import Assinatura from '../entities/Assinatura';
import AssinaturaRevogada from '../entities/AssinaturaRevogada';
import IAssinaturasRepository from '../repositories/interfaces/IAssinaturasRepository';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';

@injectable()
class RevogaValidacaoService {
  constructor(
    @inject('AssinaturasRepository')
    private assinaturasRepository: IAssinaturasRepository,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(id_validacao: number): Promise<void> {
    const validacao = await this.validacoesRepository.findById(id_validacao);

    if (!validacao) {
      throw new AppError('Esta validação não existe ou já foi concluída');
    }

    const assinaturaAnterior = await this.assinaturasRepository.findAssinaturaByCpf(
      validacao.cpf,
    );

    if (!assinaturaAnterior) {
      throw new AppError('O usuário não possui assinatura ativa!');
    }

    const revogaAssinaturaTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
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
        await queryRunner.manager.delete(
          Assinatura,
          assinaturaAnterior.id_assinatura,
        );
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new AppError(`Ocorreu um erro ao tentar revogar a assinatura!`);
      } finally {
        await queryRunner.release();
      }
    };

    await revogaAssinaturaTransaction();
  }
}

export default RevogaValidacaoService;
