import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateFinalidadeService from '../services/CreateFinalidadeService';
import DeleteFinalidadeService from '../services/DeleteFinalidadeService';
import EditFinalidadeService from '../services/EditFinalidadeService';
import ListFinalidadeService from '../services/ListFinalidadeService';

export default class FinalidadesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { descricao_fin, situacao_fin } = request.body;
    const createFinalidadeService = container.resolve(CreateFinalidadeService);

    const finalidadeCreated = await createFinalidadeService.execute({
      descricao_fin,
      situacao_fin,
      id_usuario,
    });

    return response.json(finalidadeCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, query } = request.query;
    const showListFinalidade = container.resolve(ListFinalidadeService);

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const listFinalidade = await showListFinalidade.execute(
      pageNumber,
      perPageNumber,
      query ? String(query) : undefined,
    );

    return response.status(200).json(listFinalidade);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateFinalidadeService = container.resolve(EditFinalidadeService);

    const data = {
      id_fin: Number(id),
      id_usuario,
      situacao_fin: body.situacaoFinalidade,
      descricao_fin: body.nomeFinalidade,
      usuario_alteracao: id_usuario,
    };

    const finalidade = await updateFinalidadeService.execute(data);

    return response.status(200).json(finalidade);
  }

  public async softDelete(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateFinalidadeService = container.resolve(DeleteFinalidadeService);

    const data = {
      id_fin: Number(id),
      usuario_alteracao: id_usuario,
      ...body,
    };

    const finalidade = await updateFinalidadeService.execute(data);

    return response.status(200).json(finalidade);
  }
}
