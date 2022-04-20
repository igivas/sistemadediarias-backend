import { injectable, inject } from 'tsyringe';
import IDocumentosRepository from '@modules/sga/repositories/interfaces/IDocumentosRepository';
import AppError from '../../../errors/AppError';
import Assinatura from '../entities/Assinatura';
import Documento from '../entities/Documento';

interface IRequest {
  id_documento: number;
  assinatura: Assinatura;
}

@injectable()
class CheckDocumentoAssinarService {
  constructor(
    @inject('DocumentosRepository')
    private documentosRepository: IDocumentosRepository,
  ) {}

  async execute({ id_documento, assinatura }: IRequest): Promise<Documento> {
    const documento = await this.documentosRepository.findByIdWithAssinaturas(
      id_documento,
    );

    if (!documento) {
      throw new AppError(
        `O documento de id ${id_documento} não existe na base de dados!`,
        401,
      );
    }
    const idsAssinantes = documento.assinaturas
      ? documento.assinaturas.map(assin => assin.cpf)
      : [];

    if (idsAssinantes.length >= 75) {
      throw new AppError(
        `O documento ${documento.numero_documento} - ${documento.tipo_documento}  já foi assinado pelo número máximo de pessoas (75)!`,
        404,
      );
    }

    if (idsAssinantes.includes(assinatura.cpf)) {
      throw new AppError(
        `O usuário já assinou o documento ${documento.numero_documento} - ${documento.tipo_documento}!`,
        401,
      );
    }

    return documento;
  }
}

export default CheckDocumentoAssinarService;
