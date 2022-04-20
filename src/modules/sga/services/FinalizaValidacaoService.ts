import { injectable, inject } from 'tsyringe';
import { getConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import Validacao from '../entities/Validacao';

import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';

@injectable()
class FinalizaValidacaoService {
  constructor(
    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(
    id_validacao: number,
    codigoValidacao: string,
    atualizado_por: string,
  ): Promise<any> {
    const validacaoPendente = await this.validacoesRepository.findPendente(
      id_validacao,
    );

    if (!validacaoPendente) {
      throw new AppError('Esta validacão não existe ou já foi concluída');
    }

    const compareCodigo =
      codigoValidacao === validacaoPendente.codigo_validacao;

    if (!compareCodigo) {
      throw new AppError('O código de validação não é valido!');
    }

    const validacaoAnterior = await this.validacoesRepository.findValidacaoAnteriorByCpf(
      validacaoPendente.cpf,
    );

    let validacaoAtualizada = {} as Validacao;

    const finalizaValidacaoTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (validacaoAnterior) {
          const validacaoAnteriorAtualizada = queryRunner.manager.merge(
            Validacao,
            validacaoAnterior,
            {
              status: '3',
              atualizado_por,
            },
          );

          await queryRunner.manager.save(validacaoAnteriorAtualizada);

          validacaoAtualizada = queryRunner.manager.merge(
            Validacao,
            validacaoPendente,
            {
              status: '2',
              atualizado_por,
            },
          );
          await queryRunner.manager.save(validacaoAtualizada);
        } else {
          validacaoAtualizada = queryRunner.manager.merge(
            Validacao,
            validacaoPendente,
            {
              status: '2',
              atualizado_por,
            },
          );
          await queryRunner.manager.save(validacaoAtualizada);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new AppError(`Ocorreu um erro ao tentar finalizar a validacão!`);
      } finally {
        await queryRunner.release();
      }
    };

    await finalizaValidacaoTransaction();

    // eslint-disable-next-line
    const { codigo_validacao, ...rest } = validacaoAtualizada;

    return rest;
  }
}

export default FinalizaValidacaoService;
