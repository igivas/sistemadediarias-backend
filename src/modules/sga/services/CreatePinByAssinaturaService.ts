import { injectable, inject } from 'tsyringe';
import { addDays } from 'date-fns';
import { getConnection } from 'typeorm';
import Queue from '../../../lib/Queue';
import IHashProvider from '../providers/HashProvider/IHashProvider';
import Assinatura from '../entities/Assinatura';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';
import AppError from '../../../errors/AppError';

@injectable()
class CreatePinService {
  constructor(
    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(
    assinatura: Assinatura,
  ): Promise<{ assinatura: Assinatura; pin: string; email: string }> {
    const validacao = await this.validacoesRepository.findValidacaoAtualByCpf(
      assinatura.cpf,
    );

    if (!validacao) {
      throw new AppError('Validação não encontrada!');
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const hash_pin = await this.hashProvider.generateHash(pin);

    const validade_pin = addDays(new Date(), 1);

    let assinaturaAtualizada = {} as Assinatura;

    const createLinkTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const assinaturaMergiada = queryRunner.manager.merge(
          Assinatura,
          assinatura,
          {
            hash_pin,
            validade_pin,
          },
        );

        assinaturaAtualizada = await queryRunner.manager.save(
          assinaturaMergiada,
        );

        await Queue.add('SendEmailPin', { pin, email: validacao.email });

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new AppError(`Ocorreu um erro ao tentar criar o PIN!`);
      } finally {
        await queryRunner.release();
      }
    };

    await createLinkTransaction();

    return { assinatura: assinaturaAtualizada, pin, email: validacao.email };
  }
}

export default CreatePinService;
