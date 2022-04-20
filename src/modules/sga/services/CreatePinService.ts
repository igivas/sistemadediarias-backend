import { injectable, inject, container } from 'tsyringe';
import { addDays } from 'date-fns';
import { getConnection } from 'typeorm';
import Queue from '../../../lib/Queue';
import AppError from '../../../errors/AppError';
import IAssinaturasRepository from '../repositories/interfaces/IAssinaturasRepository';
import IHashProvider from '../providers/HashProvider/IHashProvider';
import Assinatura from '../entities/Assinatura';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';
import CreateLinksService from './CreateLinkService';

@injectable()
class CreatePinService {
  constructor(
    @inject('AssinaturasRepository')
    private assinaturasRepository: IAssinaturasRepository,

    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(
    pes_codigo: string,
  ): Promise<{ assinatura: Assinatura; pin: string; email: string }> {
    const validacao = await this.validacoesRepository.findValidacaoAtualByPesCodigo(
      pes_codigo,
    );

    if (!validacao) {
      throw new AppError(
        'O usuário não possui email validado! Procure o sargenteante para iniciar validação!',
      );
    }
    const assinatura = await this.assinaturasRepository.findAssinaturaAtivaByPesCodigo(
      pes_codigo,
    );

    if (!assinatura) {
      const createLinksService = container.resolve(CreateLinksService);
      const { email } = await createLinksService.execute(
        validacao.id_validacao,
        '0',
      );

      throw new AppError(
        `O usuário não possui assinatura válida! Um link para gerar assinatura foi enviado para: ${email}`,
        401,
      );
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const hash_pin = await this.hashProvider.generateHash(pin);

    const validade_pin = addDays(new Date(), 1);

    let assinaturaAtualizada = {} as Assinatura;

    const createPinTransaction = async (): Promise<void> => {
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

    await createPinTransaction();

    return { assinatura: assinaturaAtualizada, pin, email: validacao.email };
  }
}

export default CreatePinService;
