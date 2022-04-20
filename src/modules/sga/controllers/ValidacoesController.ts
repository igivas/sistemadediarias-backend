import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import * as Yup from 'yup';
import AppError from '../../../errors/AppError';
import CreateValidacoesService from '../services/CreateValidacaoService';
import FinalizaValidacaoService from '../services/FinalizaValidacaoService';
import RevogaValidacaoService from '../services/RevogaValidacaoService';
import ListValidacaoService from '../services/ListValidacaoService';

export default class ValidacoesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { pes_codigo, email, militar } = request.body;
    const { id_usuario } = request.user;

    const schema = Yup.object().shape({
      pes_codigo: Yup.string().required(
        'A propriedade pes_codigo é requerida no corpo da requisição!',
      ),
      email: Yup.string()
        .email('Um email válido é requerido!')
        .required('A propriedade email é requerida no corpo da requisição!'),
      militar: Yup.boolean().required(
        'A propriedade militar é requerida no corpo da requisição!',
      ),
    });

    await schema
      .validate(request.body, { abortEarly: true })
      .catch((err: { errors: string[] }) => {
        throw new AppError(err.errors[0], 400);
      });
    const createValidacoesService = container.resolve(CreateValidacoesService);

    const validacao = await createValidacoesService.execute({
      pes_codigo,
      militar,
      email: String(email).toLowerCase(),
      criado_por: String(id_usuario),
      atualizado_por: String(id_usuario),
    });

    return response.json(classToClass(validacao));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { page, perPage, sortfields, sorts } = request.query;
    const listValidacoesService = container.resolve(ListValidacaoService);

    const validacoes = await listValidacoesService.execute(
      Number(id_usuario),
      Number(page),
      Number(perPage),
      sortfields ? String(sortfields) : undefined,
      sorts ? String(sorts) : undefined,
    );

    return response.json(validacoes);
  }

  public async updateFinaliza(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { codigo_validacao } = request.body;
    const { id_usuario } = request.user;

    const finalizaValidacaoService = container.resolve(
      FinalizaValidacaoService,
    );

    const validacao = await finalizaValidacaoService.execute(
      Number(id),
      codigo_validacao,
      String(id_usuario),
    );

    return response.json(classToClass(validacao));
  }

  public async updateRevoga(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;

    const revogaValidacaoService = container.resolve(RevogaValidacaoService);

    const validacao = await revogaValidacaoService.execute(
      Number(id),
      id_usuario,
    );

    return response.json(classToClass(validacao));
  }
}
