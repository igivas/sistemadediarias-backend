import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import api from '../../../services/api';

export type IPostResponseDocumentoSGA = {
  id_sistema: string;

  id_documento_origem: number;
  numero_documento: string;
  id_tipo_documento: number;
  tipo_documento: string;
  cpfs_interessados: string;
  qtd_pg_documento_original: number;
  ext: string;
  id_documento: number;
  hash_sha1: string;
  hash_md5: string;
  verificador: string;
  assinado: boolean;
  path: string;
  url: string;
};

@injectable()
class EnviarDocumentoSga {
  constructor() {}

  async execute(
    idTipoDocumento: number,
    documento: Buffer,
    idDocumentoOrigem: number,
    numeroDocumento: string,
    cpfInteressado: string,
    opmsInteressadas: string,
  ): Promise<IPostResponseDocumentoSGA | undefined> {
    const formData = new FormData();
    // fs.writeFileSync(`${__dirname}/movimentacao.pdf`, documento);

    formData.append('files', documento, {
      contentType: 'application/pdf',
      filename: `documento${numeroDocumento}.pdf`,
      knownLength: documento.byteLength,
    });

    formData.append('id_sistema', process.env.ID_SISTEMA);
    formData.append('id_tipo_documento', 1);
    formData.append('tipo_documento', 'Termo');
    formData.append('id_documento_origem', idDocumentoOrigem);
    formData.append('numero_documento', numeroDocumento);
    formData.append('opm_interessado', opmsInteressadas);
    formData.append('cpfs_interessados', cpfInteressado);

    try {
      const response = await api.post<IPostResponseDocumentoSGA>(
        'documentos',
        formData as any,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );
      return response.data;
    } catch (error) {
      // throw new AppError('Não pode enviar documento para SGA!');
      // console.log(error);
      return undefined;
    }
  }
}
export default EnviarDocumentoSga;
