import { injectable, inject } from 'tsyringe';
import ISistemasRespository from '@modules/seg/repositories/interfaces/ISistemasRespository';
import IDocumentosRepository from '@modules/sga/repositories/interfaces/IDocumentosRepository';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import Path from 'path';
import crypto from 'crypto';
import { getConnection } from 'typeorm';
import CreateHashIdService from './CreateHashIdService';
import AppError from '../../../errors/AppError';
import Documento from '../entities/Documento';

interface IRequest {
  id_sistema: number;
  id_tipo_documento: number;
  id_documento_origem: number;
  tipo_documento: string;
  numero_documento: string;
  cpfs_interessados: string;
  opm_interessado?: number;
  files: Express.Multer.File[];
}

interface IResponse extends Documento {
  url: string;
}

@injectable()
class CreateDocumentoPDFService {
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
    const sistema = await this.sistemasRepository.findById(id_sistema);

    if (!sistema) {
      throw new AppError('O Sistema informado não existe!', 404);
    }

    const documento = await this.documentosRepository.findBySistemaAndDocumento(
      id_sistema,
      id_tipo_documento,
      id_documento_origem,
    );

    if (documento) {
      throw new AppError(
        `O documento do sistema ${sistema.sis_nome}, id_tipo_documento = ${id_tipo_documento} e id_documento_origem = ${id_documento_origem} já consta na base de dados!`,
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
    const hashIdService = new CreateHashIdService();

    const idSistema = hashIdService.execute(id_sistema, 3);
    const idTipoDocumento = hashIdService.execute(id_tipo_documento, 3);
    const idDocumento = hashIdService.execute(id_documento_origem, 6);

    const verificador = `${idSistema}-${idTipoDocumento}-${idDocumento}`;

    const year = new Date().getFullYear();

    const filename = verificador;
    const basePath = `documentos/${year}/${sistema.sis_sigla}`;
    const fullPath = Path.join(__dirname, '..', '..', '..', '..', basePath);
    const baseUrl = `${process.env.API_BASE_URL}`;
    const fullPathLink = `${baseUrl}/documentos/pdf/${year}/${sistema.sis_sigla}/${filename}`;

    pdfDoc.setTitle(`${tipo_documento} ${numero_documento}`);
    pdfDoc.setSubject(`Documento do ${sistema.sis_nome}`);
    pdfDoc.setProducer('SISTEMA GESTOR DE ASSINATURAS - SGA');

    const qtd_pg_documento_original = pdfDoc.getPages().length;

    const pdfBytes = await pdfDoc.save();

    const sumSha1 = crypto.createHash('sha1');
    const sumMd5 = crypto.createHash('md5');

    sumSha1.update(pdfBytes);
    sumMd5.update(pdfBytes);

    const hash_sha1 = sumSha1.digest('hex');
    const hash_md5 = sumMd5.digest('hex');

    const documentoObject = {
      id_sistema,
      filename,
      id_tipo_documento,
      tipo_documento,
      id_documento_origem,
      numero_documento,
      hash_sha1,
      qtd_pg_documento_original,
      hash_md5,
      verificador,
      path: `/${year}/${sistema.sis_sigla}/${filename}`,
      ext: 'pdf',
      cpfs_interessados,
      opm_interessado,
      assinado: false,
    };

    let documentoCriado = {} as Documento;

    const createDocumentoTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        documentoCriado = queryRunner.manager.create(
          Documento,
          documentoObject,
        );

        await queryRunner.manager.save(documentoCriado);

        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(`${fullPath}`, { recursive: true });
        }

        fs.writeFileSync(`${fullPath}/${filename}.pdf`, pdfBytes);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new AppError(`Ocorreu um erro ao tentar criar o documento!`);
      } finally {
        await queryRunner.release();
      }
    };

    await createDocumentoTransaction();

    return { ...documentoCriado, url: fullPathLink };
  }
}

export default CreateDocumentoPDFService;
