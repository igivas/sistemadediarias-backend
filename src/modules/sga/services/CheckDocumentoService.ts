import { injectable, inject } from 'tsyringe';
import IDocumentosRepository from '@modules/sga/repositories/interfaces/IDocumentosRepository';
import { format } from 'date-fns';
import AppError from '../../../errors/AppError';

@injectable()
class CheckDocumento {
  constructor(
    @inject('DocumentosRepository')
    private documentosRepository: IDocumentosRepository,
  ) {}

  async execute(codigo: string): Promise<any> {
    let response = {};

    const documento = await this.documentosRepository.findByVerificador(codigo);

    if (!documento) {
      throw new AppError('Código de verificador inválido!', 404);
    }

    const formatData = (date: Date): string => {
      return format(date, 'dd/MM/yyyy HH:mm:ss');
    };

    response = {
      ...documento,
      url: `${process.env.API_BASE_URL}/documentos/pdf${documento.path}`,
      criado_em: formatData(documento.criado_em),
    };
    return response;
  }
}

export default CheckDocumento;
