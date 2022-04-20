import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTransporteService from '../services/CreateTransporteService';
import DeleteTransporteService from '../services/DeleteTransporteService';

import EditTransporteService from '../services/EditTransporteService';
import ListTransporteService from '../services/ListTransporteService';

export default class TransportesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { descricao_tran, situacao_tran } = request.body;

    const createTransporteCreated = container.resolve(CreateTransporteService);

    const transporteCreated = await createTransporteCreated.execute({
      descricao_tran,
      situacao_tran,
      id_usuario,
    });

    return response.json(transporteCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, query } = request.query;
    const showListTransporte = container.resolve(ListTransporteService);

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const listTransporte = await showListTransporte.execute(
      pageNumber,
      perPageNumber,
      query ? String(query) : undefined,
    );

    return response.status(200).json(listTransporte);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateTransporteService = container.resolve(EditTransporteService);

    const data = {
      id_tran: Number(id),
      id_usuario,
      situacao_tran: body.situacaoTransporte,
      descricao_tran: body.nomeTransporte,
      usuario_alteracao: id_usuario,
    };

    const transporte = await updateTransporteService.execute(data);

    return response.status(200).json(transporte);
  }

  public async softDelete(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateTransporteService = container.resolve(DeleteTransporteService);

    const data = {
      id_tran: Number(id),
      usuario_alteracao: id_usuario,
      ...body,
    };

    const transporte = await updateTransporteService.execute(data);

    return response.status(200).json(transporte);
  }
}
