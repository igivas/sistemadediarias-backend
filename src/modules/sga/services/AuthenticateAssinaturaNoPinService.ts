import { injectable, inject, container } from 'tsyringe';
import IHashProvider from '@modules/shared/providers/HashProvider/IHashProvider';

import { isAfter } from 'date-fns';
import AppError from '../../../errors/AppError';
import IAssinaturasRepository from '../repositories/interfaces/IAssinaturasRepository';
import CreateLinksService from './CreateLinkService';
import Assinatura from '../entities/Assinatura';

interface IRequest {
  cpf_assinante: string;
  assinatura: string;
}

@injectable()
class AuthenticateUsuarioTermoService {
  constructor(
    @inject('AssinaturasRepository')
    private assinaturasRepository: IAssinaturasRepository,

    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    cpf_assinante,
    assinatura,
  }: IRequest): Promise<Assinatura> {
    const assinaturaUsuario = await this.assinaturasRepository.findAssinaturaByCpf(
      cpf_assinante,
    );

    if (!assinaturaUsuario) {
      throw new AppError(
        'O usuário não possui assinatura eletrônica! Procurar sargenteante!',
        404,
      );
    }

    const naoPossuiAssinaturaAtiva = (): boolean => {
      if (isAfter(new Date(), assinaturaUsuario.validade_assinatura)) {
        return true;
      }
      return false;
    };

    if (naoPossuiAssinaturaAtiva()) {
      const createLinksService = container.resolve(CreateLinksService);
      const { email } = await createLinksService.execute(
        Number(assinaturaUsuario.id_validacao),
        '0',
      );

      throw new AppError(
        `O usuário não possui assinatura válida! Um link para gerar assinatura foi enviado para: ${email}`,
        403,
      );
    }

    const assinaturaMatched = await this.hashProvider.compareHash(
      assinatura,
      assinaturaUsuario.hash_assinatura,
    );

    if (!assinaturaMatched) {
      throw new AppError('Assinatura está incorreta.', 401);
    }
    return assinaturaUsuario;
  }
}

export default AuthenticateUsuarioTermoService;
