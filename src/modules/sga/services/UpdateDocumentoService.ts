import { injectable, inject } from 'tsyringe';
import ISistemasRespository from '@modules/seg/repositories/interfaces/ISistemasRespository';
import IDocumentosRepository from '@modules/sga/repositories/interfaces/IDocumentosRepository';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import Path from 'path';
import crypto from 'crypto';
import AppError from '../../../errors/AppError';
import Documento from '../entities/Documento';

interface IRequest {
  id_sistema: number;
  id_tipo_documento: number;
  id_documento_origem: number;
  tipo_documento: string;
  numero_documento: string;
  cpfs_interessados: string;
  opm_interessado: number;
  files: Express.Multer.File[];
}

interface IResponse extends Documento {
  url: string;
}

@injectable()
class UpdateDocumentoPDFService {
  constructor(
    @inject('DocumentosRepository')
    private documentosRepository: IDocumentosRepository,

    @inject('SistemasRepository')
    private sistemasRepository: ISistemasRespository,
  ) {}

  async execute({
    id_sistema,
    id_tipo_documento,
    id_documento_origem,
    tipo_documento,
    numero_documento,
    cpfs_interessados,
    opm_interessado,
    files,
  }: IRequest): Promise<IResponse> {
    const documento = await this.documentosRepository.findBySistemaAndDocumento(
      id_sistema,
      id_tipo_documento,
      id_documento_origem,
    );

    if (!documento) {
      throw new AppError(`O documento não existe na base dados!`, 401);
    }

    const sistema = await this.sistemasRepository.findById(id_sistema);

    if (!sistema) {
      throw new AppError('O Sistema informado não existe!', 401);
    }

    if (documento.assinado) {
      throw new AppError(
        'O documento não pode ser atualizado pois já foi assinado!',
        401,
      );
    }

    let pdfDoc = await PDFDocument.create();

    if (files.length > 1) {
      const promises = files.map(async (file: any) => {
        const pdf = await PDFDocument.load(file.buffer);
        const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
      });
      await Promise.all(promises);
      pdfDoc.save();
    } else {
      pdfDoc = await PDFDocument.load(files[0].buffer);
    }

    pdfDoc.setTitle(`${tipo_documento} ${numero_documento}`);
    pdfDoc.setSubject(`Documento do ${sistema.sis_nome}`);
    pdfDoc.setProducer('SISTEMA GESTOR DE ASSINATURAS - SGA');

    const pdfBytes = await pdfDoc.save();

    const sumSha1 = crypto.createHash('sha1');
    const sumMd5 = crypto.createHash('md5');

    sumSha1.update(pdfBytes);
    sumMd5.update(pdfBytes);

    const hash_sha1 = sumSha1.digest('hex');
    const hash_md5 = sumMd5.digest('hex');

    const fullPath = Path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'documentos',
      documento.path,
    );

    try {
      fs.writeFileSync(`${fullPath}.pdf`, pdfBytes);
    } catch (error) {
      throw new AppError('Ocorreu um erro ao atualizar o arquivo', 500);
    }
    const baseUrl = `${process.env.API_BASE_URL}`;
    const fullPathLink = `${baseUrl}/documentos/pdf${documento.path}`;

    const documentoObject = {
      id_sistema,
      id_tipo_documento,
      tipo_documento,
      id_documento_origem,
      numero_documento,
      hash_sha1,
      hash_md5,
      cpfs_interessados,
      opm_interessado,
      assinado: false,
    };

    const documentoCriado = await this.documentosRepository.update(documento, {
      ...documentoObject,
    });

    return { ...documentoCriado, url: fullPathLink };
  }
}

export default UpdateDocumentoPDFService;
