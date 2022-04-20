import { injectable, inject } from 'tsyringe';
import IDocumentosRepository from '@modules/sga/repositories/interfaces/IDocumentosRepository';
import AppError from '../../../errors/AppError';

interface IRequest {
  id_documento: string;
}

@injectable()
class ShowDocumento {
  constructor(
    @inject('DocumentosRepository')
    private documentosRepository: IDocumentosRepository,
  ) {}

  async execute({ id_documento }: IRequest): Promise<any> {
    const documento = await this.documentosRepository.findByIdDocumento(
      Number(id_documento),
    );

    if (!documento) {
      throw new AppError('Não existe documento com esse id!', 404);
    }
    return documento;
  }
}

export default ShowDocumento;
