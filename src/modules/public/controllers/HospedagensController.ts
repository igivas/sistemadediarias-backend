import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateHospedagemService from '../services/CreateHospedagemService';
import DeleteHospedagemService from '../services/DeleteHospedagemService';
import EditHospedagemService from '../services/EditHospedagemService';
import ListHospedagemService from '../services/ListHospedagemService';

export default class HospedagensController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { descricao_hosp, situacao_hosp } = request.body;
    const createHospedagemService = container.resolve(CreateHospedagemService);

    const hospedagemCreated = await createHospedagemService.execute({
      descricao_hosp,
      situacao_hosp,
      id_usuario,
    });

    return response.json(hospedagemCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, query } = request.query;
    const showListHospedagem = container.resolve(ListHospedagemService);

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const listHospedagem = await showListHospedagem.execute(
      pageNumber,
      perPageNumber,
      query ? String(query) : undefined,
    );

    return response.status(200).json(listHospedagem);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateHospedagemService = container.resolve(EditHospedagemService);

    const data = {
      id_hosp: Number(id),
      id_usuario,
      situacao_hosp: body.situacaoHospedagem,
      descricao_hosp: body.nomeHospedagem,
      usuario_alteracao: id_usuario,
    };

    const hospedagem = await updateHospedagemService.execute(data);

    return response.status(200).json(hospedagem);
  }

  public async softDelete(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateHospedagemService = container.resolve(DeleteHospedagemService);

    const data = {
      id_hosp: Number(id),
      usuario_alteracao: id_usuario,
      ...body,
    };

    const hospedagem = await updateHospedagemService.execute(data);

    return response.status(200).json(hospedagem);
  }
}
