import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { container } from 'tsyringe';
import * as Yup from 'yup';
import CreateDocumentoService from '../services/CreateDocumentoService';
import AuthenticateAssinaturaNoPinService from '../services/AuthenticateAssinaturaNoPinService';
import CheckDocumentoService from '../services/CheckDocumentoService';
import AppError from '../../../errors/AppError';
import UpdateDocumentoService from '../services/UpdateDocumentoService';
import UpdateDocumentoReassinarService from '../services/UpdateDocumentoReassinarService';
import AuthenticateAssinaturaService from '../services/AuthenticateAssinaturaService';
import AssinarDocumentoService from '../services/AssinarDocumentoService';
import CheckDocumentoAssinarService from '../services/CheckDocumentoAssinarService';
import ListDocumentosService from '../services/ListDocumentosService';
import CreateDocumentoPDFService from '../services/CreateDocumentoPdfService';

interface IRequestMulter extends Request {
  files: Express.Multer.File[];
}

export default class DocumentosController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { opm, cpf } = request.query;

    const listDocumentos = container.resolve(ListDocumentosService);

    const documentos = await listDocumentos.execute(
      String(cpf),
      opm ? Number(opm) : undefined,
    );

    return response.json(documentos);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const { sistema, arquivo } = request.params;
    const caminho = `/documentos/${sistema}/${arquivo}.pdf`;
    const dirPath = path.join(__dirname, '..', '..', '..', '..', caminho);
    const data = fs.readFileSync(dirPath);
    response.contentType('application/pdf');
    response.send(data);
  }

  public async check(request: Request, response: Response): Promise<Response> {
    const { codigo } = request.query;

    const documentos = container.resolve(CheckDocumentoService);

    const documento = await documentos.execute(String(codigo).toLowerCase());

    return response.status(200).json(documento);
  }

  public async showPdf(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sistema, ano, arquivo } = request.params;

    const caminho = `/documentos/${ano}/${sistema}/${arquivo}.pdf`;
    const dirPath = path.join(__dirname, '..', '..', '..', '..', caminho);

    const fileExists = fs.existsSync(dirPath);
    if (!fileExists) {
      return response.status(404).json({ message: 'File not found' });
    }
    const data = fs.readFileSync(dirPath);

    response.contentType('application/pdf');
    return response.send(data);
  }

  public async create(request: any, response: Response): Promise<any> {
    const {
      id_sistema,
      id_tipo_documento,
      tipo_documento,
      id_documento_origem,
      numero_documento,
      cpfs_interessados,
      opm_interessado,
    } = request.body;

    const schema = Yup.object().shape({
      id_sistema: Yup.number().required(
        'A propriedade id_sistema é requerida no corpo da requisição!',
      ),
      id_tipo_documento: Yup.number().required(
        'A propriedade id_tipo_documento é requerida no corpo da requisição!',
      ),
      id_documento_origem: Yup.number().required(
        'A propriedade id_documento_origem é requerida no corpo da requisição!',
      ),
      tipo_documento: Yup.string().required(
        'A propriedade tipo_documento do tipo texto é requerida no corpo da requisição!',
      ),
      numero_documento: Yup.string().required(
        'A propriedade numero_documento do tipo texto é requerida no corpo da requisição! Ex.: 123/2020',
      ),
      cpfs_interessados: Yup.string(),
      opm_interessado: Yup.number().when('cpfs_interessados', {
        is: undefined,
        then: Yup.number().required(
          'A propriedade cpfs_interessados ou opm_interessado é requerida no corpo da requisição!',
        ),
      }),
    });

    await schema
      .validate(request.body, { abortEarly: true })
      .catch((err: { errors: string[] }) => {
        throw new AppError(err.errors[0], 400);
      });

    const createDocumento = container.resolve(CreateDocumentoService);

    const documento = await createDocumento.execute({
      id_sistema,
      id_tipo_documento,
      id_documento_origem,
      numero_documento,
      tipo_documento,
      cpfs_interessados,
      opm_interessado,
      files: request.files,
    });

    return response.status(201).json(documento);
  }

  public async update(request: any, response: Response): Promise<any> {
    const {
      id_sistema,
      id_tipo_documento,
      tipo_documento,
      id_documento_origem,
      numero_documento,
      cpfs_interessados,
      opm_interessado,
    } = request.body;

    const schema = Yup.object().shape({
      id_sistema: Yup.number().required(
        'A propriedade id_sistema é requerida no corpo da requisição!',
      ),
      id_tipo_documento: Yup.number().required(
        'A propriedade id_tipo_documento é requerida no corpo da requisição!',
      ),
      id_documento_origem: Yup.number().required(
        'A propriedade id_documento_origem é requerida no corpo da requisição!',
      ),
      tipo_documento: Yup.string().required(
        'A propriedade tipo_documento do tipo texto é requerida no corpo da requisição!',
      ),
      numero_documento: Yup.string().required(
        'A propriedade numero_documento do tipo texto é requerida no corpo da requisição! Ex.: 123/2020',
      ),
      cpfs_interessados: Yup.string(),
      opm_interessado: Yup.number().when('cpfs_interessados', {
        is: undefined,
        then: Yup.number().required(
          'A propriedade cpfs_interessados ou opm_interessado é requerida no corpo da requisição!',
        ),
      }),
    });

    await schema
      .validate(request.body, { abortEarly: true })
      .catch((err: { errors: string[] }) => {
        throw new AppError(err.errors[0], 400);
      });

    const updateDocumento = container.resolve(UpdateDocumentoService);

    // await authenticateAssinatura.execute({
    //   cpf,
    //   assinatura,
    //   pin,
    // });

    const documento = await updateDocumento.execute({
      id_sistema,
      id_tipo_documento,
      id_documento_origem,
      numero_documento,
      tipo_documento,
      cpfs_interessados,
      opm_interessado,
      files: request.files,
    });

    return response.status(200).json(documento);
  }

  public async createAssinar(request: any, response: Response): Promise<any> {
    const {
      ids_documento,
      cpf_assinante,
      assinatura,
      pin,
      tipo_assinatura,
    } = request.body;

    const schema = Yup.object().shape({
      ids_documento: Yup.array()
        .of(
          Yup.number().positive(
            'A propriedade ids_documento deve ser um array de números',
          ),
        )
        .required(
          'A propriedade ids_documento é requerida no corpo da requisição!',
        ),
      cpf_assinante: Yup.string().required(
        'A propriedade cpf_assinante é requerida no corpo da requisição!',
      ),
      assinatura: Yup.string().required(
        'A propriedade assinatura é requerida no corpo da requisição!',
      ),
      pin: Yup.string().required(
        'A propriedade pin é requerida no corpo da requisição!',
      ),
      tipo_assinatura: Yup.string().required(
        'A propriedade tipo_assinatura é requerida no corpo da requisição!',
      ),
    });

    await schema
      .validate(request.body, { abortEarly: true })
      .catch((err: { errors: string[] }) => {
        throw new AppError(err.errors[0], 400);
      });

    const authenticateAssinatura = container.resolve(
      AuthenticateAssinaturaService,
    );

    const assinaturaAutenticada = await authenticateAssinatura.execute({
      cpf_assinante,
      assinatura,
      pin,
    });

    const checkDocumentosService = container.resolve(
      CheckDocumentoAssinarService,
    );

    const ids: number[] = ids_documento;

    const promisesCheckDocumento = ids.map(id_documento => {
      return checkDocumentosService.execute({
        id_documento,
        assinatura: assinaturaAutenticada,
      });
    });

    const documentos = await Promise.all(promisesCheckDocumento);

    const assinarDocumento = container.resolve(AssinarDocumentoService);

    let resultados: any = [];
    // eslint-disable-next-line
    for (const documento of documentos) {
      // eslint-disable-next-line
      const resultado = await assinarDocumento.execute({
        documento,
        assinatura: assinaturaAutenticada,
        tipo_assinatura,
      });

      if (resultado) {
        resultados = [...resultados, resultado];
      }
    }

    if (resultados.length < 1) {
      throw new AppError('Ocorreu um erro ao assinar o(s) documento(s)!');
    }

    return response.status(201).json(resultados);
  }

  public async createAssinarTermo(
    request: any,
    response: Response,
  ): Promise<any> {
    const {
      id_sistema,
      id_tipo_documento,
      tipo_documento,
      id_documento_origem,
      numero_documento,
      cpf_assinante,
      assinatura,
    } = request.body;

    const schema = Yup.object().shape({
      id_sistema: Yup.number().required(
        'A propriedade id_sistema é requerida no corpo da requisição!',
      ),
      id_tipo_documento: Yup.number().required(
        'A propriedade id_tipo_documento é requerida no corpo da requisição!',
      ),
      id_documento_origem: Yup.number().required(
        'A propriedade id_documento_origem é requerida no corpo da requisição!',
      ),
      tipo_documento: Yup.string().required(
        'A propriedade tipo_documento do tipo texto é requerida no corpo da requisição!',
      ),
      numero_documento: Yup.string().required(
        'A propriedade numero_documento do tipo texto é requerida no corpo da requisição! Ex.: 123/2020',
      ),
      cpf_assinante: Yup.string().required(
        'A propriedade cpf_assinante é requerida no corpo da requisição!',
      ),

      assinatura: Yup.string().required(
        'A propriedade assinatura é requerida no corpo da requisição!',
      ),
    });
    await schema
      .validate(request.body, { abortEarly: true })
      .catch((err: { errors: string[] }) => {
        throw new AppError(err.errors[0], 400);
      });

    const authenticateAssinatura = container.resolve(
      AuthenticateAssinaturaNoPinService,
    );

    const assinaturaAutenticada = await authenticateAssinatura.execute({
      cpf_assinante,
      assinatura,
    });

    const createDocumentosService = container.resolve(CreateDocumentoService);

    const documento = await createDocumentosService.execute({
      id_sistema,
      id_tipo_documento,
      id_documento_origem,
      numero_documento,
      tipo_documento,
      cpfs_interessados: cpf_assinante,
      files: request.files,
    });

    const checkDocumentosService = container.resolve(
      CheckDocumentoAssinarService,
    );

    const documentocheck = await checkDocumentosService.execute({
      id_documento: documento.id_documento,
      assinatura: assinaturaAutenticada,
    });

    const assinarDocumento = container.resolve(AssinarDocumentoService);

    const documentoAssinado = await assinarDocumento.execute({
      documento: documentocheck,
      assinatura: assinaturaAutenticada,
      tipo_assinatura: '0',
    });

    return response.status(201).json(documentoAssinado);
  }

  public async updateReassinar(request: any, response: Response): Promise<any> {
    const {
      id_sistema,
      id_tipo_documento,
      tipo_documento,
      id_documento_origem,
      numero_documento,
      cpfs_interessados,
      opm_interessado,
    } = request.body;

    const schema = Yup.object().shape({
      id_sistema: Yup.number().required(
        'A propriedade id_sistema é requerida no corpo da requisição!',
      ),
      id_tipo_documento: Yup.number().required(
        'A propriedade id_tipo_documento é requerida no corpo da requisição!',
      ),
      id_documento_origem: Yup.number().required(
        'A propriedade id_documento_origem é requerida no corpo da requisição!',
      ),
      tipo_documento: Yup.string().required(
        'A propriedade tipo_documento do tipo texto é requerida no corpo da requisição!',
      ),
      numero_documento: Yup.string().required(
        'A propriedade numero_documento do tipo texto é requerida no corpo da requisição! Ex.: 123/2020',
      ),
      cpfs_interessados: Yup.string(),
      opm_interessado: Yup.number().when('cpfs_interessados', {
        is: undefined,
        then: Yup.number().required(
          'A propriedade cpfs_interessados ou opm_interessado é requerida no corpo da requisição!',
        ),
      }),
    });

    await schema
      .validate(request.body, { abortEarly: true })
      .catch((err: { errors: string[] }) => {
        throw new AppError(err.errors[0], 400);
      });

    const updateDocumento = container.resolve(UpdateDocumentoReassinarService);

    const documento = await updateDocumento.execute({
      id_sistema,
      id_tipo_documento,
      id_documento_origem,
      numero_documento,
      tipo_documento,
      cpfs_interessados,
      opm_interessado,
      files: request.files,
    });

    return response.status(200).json(documento);
  }

  public async createDocumento(request: any, response: Response): Promise<any> {
    const createDocumentoPDFService = container.resolve(
      CreateDocumentoPDFService,
    );

    response.setHeader('Content-Type', 'application/pdf');

    const documento = await createDocumentoPDFService.execute();
    response.send(documento);
  }
}
