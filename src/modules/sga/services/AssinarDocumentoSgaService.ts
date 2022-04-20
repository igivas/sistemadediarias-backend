import axios from 'axios';
import { injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import api from '../../../services/api';

export type IRequest = {
  id_documento_sga: number;
  cpf_assinante: string;
  assinatura: string;
  pin: number;
};

@injectable()
class AssinarDocumentoSgaService {
  constructor() {}

  async execute(data: IRequest): Promise<any | undefined> {
    try {
      const dados = {
        ids_documento: [data.id_documento_sga],
        cpf_assinante: data.cpf_assinante,
        assinatura: data.assinatura,
        pin: data.pin,
        tipo_assinatura: '0',
      };
      const response = await api.post('/documentos/assinar', dados);
      return response.data;
    } catch (error) {
      throw new AppError(error.response.data.message, 401);
    }
  }
}
export default AssinarDocumentoSgaService;
