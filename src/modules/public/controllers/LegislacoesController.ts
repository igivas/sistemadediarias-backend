import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateLegislacaoService from '../services/CreateLegislacaoService';
import DeleteLegislacaoService from '../services/DeleteLegislacaoService';
import EditLegislacaoService from '../services/EditLegislacaoService';
import ListLegislacaoService from '../services/ListLegislacaoService';
import ShowLegislacaoService from '../services/ShowLegislacaoService';

export default class LegislacoesController {
  // private legislacaoRepository: Repository<Legislacao>;

  public async create(request: Request, response: Response): Promise<Response> {
    const { decreto_leg, situacao_leg, usuario_cadastro } = request.body;

    const createLegislacaoService = container.resolve(CreateLegislacaoService);

    const legislacaoCreated = await createLegislacaoService.execute({
      decreto_leg,
      situacao_leg,
      usuario_cadastro,
    });

    return response.json(legislacaoCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, query } = request.query;
    const showListLegislacao = container.resolve(ListLegislacaoService);

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const listLegislacao = await showListLegislacao.execute(
      pageNumber,
      perPageNumber,
      query ? String(query) : undefined,
    );

    return response.status(200).json(listLegislacao);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateLesgilacaoService = container.resolve(EditLegislacaoService);

    const data = {
      id_leg: Number(id),
      id_usuario,
      situacao_leg: body.situacaoLegislacao,
      decreto_leg: body.nomeLegislacao,
      usuario_alteracao: id_usuario,
    };

    const legislacao = await updateLesgilacaoService.execute(data);

    return response.status(200).json(legislacao);
  }

  public async softDelete(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateLesgilacaoService = container.resolve(DeleteLegislacaoService);

    const data = {
      id_leg: Number(id),
      usuario_alteracao: id_usuario,
      ...body,
    };

    const legislacao = await updateLesgilacaoService.execute(data);

    return response.status(200).json(legislacao);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showLegislacaoService = container.resolve(ShowLegislacaoService);
    const data = {
      id_leg: Number(id),
    };
    const legislacao = await showLegislacaoService.execute(data);

    return response.status(200).json(legislacao);
  }
}
