import { injectable, inject, container } from 'tsyringe';
import IHashProvider from '@modules/shared/providers/HashProvider/IHashProvider';
import { isAfter } from 'date-fns';
import AppError from '../../../errors/AppError';
import IAssinaturasRepository from '../repositories/interfaces/IAssinaturasRepository';
import CreatePinService from './CreatePinByAssinaturaService';
import CreateLinksService from './CreateLinkService';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';
import Assinatura from '../entities/Assinatura';

interface IRequest {
  cpf_assinante: string;
  assinatura: string;
  pin: string;
}

@injectable()
class AuthenticateUsuarioService {
  constructor(
    @inject('AssinaturasRepository')
    private assinaturasRepository: IAssinaturasRepository,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,

    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    cpf_assinante,
    assinatura,
    pin,
  }: IRequest): Promise<Assinatura> {
    const validacao = await this.validacoesRepository.findValidacaoAtualByCpf(
      cpf_assinante,
    );

    if (!validacao) {
      throw new AppError(
        'O usuário não possui email validado! Procurar sargenteante!',
        404,
      );
    }

    const assinaturaUsuario = await this.assinaturasRepository.findAssinaturaByCpf(
      cpf_assinante,
    );

    const naoPossuiAssinaturaAtiva = (): boolean => {
      if (
        !assinaturaUsuario ||
        isAfter(new Date(), assinaturaUsuario.validade_assinatura)
      ) {
        return true;
      }
      return false;
    };

    if (naoPossuiAssinaturaAtiva() || !assinaturaUsuario) {
      const createLinksService = container.resolve(CreateLinksService);
      const { email } = await createLinksService.execute(
        Number(validacao.id_validacao),
        '0',
      );

      throw new AppError(
        `O usuário não possui assinatura válida! Um link para gerar assinatura foi enviado para: ${email}`,
        403,
      );
    }

    const naoPossuiPinValido = (): boolean => {
      if (!assinaturaUsuario.hash_pin) {
        return true;
      }
      if (isAfter(new Date(), assinaturaUsuario.validade_pin)) {
        return true;
      }
      return false;
    };

    if (naoPossuiPinValido()) {
      const serviceCreatePIN = container.resolve(CreatePinService);
      const result = await serviceCreatePIN.execute(assinaturaUsuario);

      throw new AppError(
        `Usuário não possui PIN válido! Um novo PIN foi enviado para o email do usuário: ${result.email}`,
        403,
      );
    }

    const assinaturaMatched = await this.hashProvider.compareHash(
      assinatura,
      assinaturaUsuario.hash_assinatura,
    );

    const pinMatched = await this.hashProvider.compareHash(
      pin,
      assinaturaUsuario.hash_pin,
    );

    if (!assinaturaMatched || !pinMatched) {
      throw new AppError('Assinatura ou pin incorreto.', 401);
    }

    return assinaturaUsuario;
  }
}

export default AuthenticateUsuarioService;
