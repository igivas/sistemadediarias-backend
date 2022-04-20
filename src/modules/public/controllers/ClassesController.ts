import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateClasseService from '../services/CreateClasseService';
import ListClasseService from '../services/ListClasseService';
import EditClasseService from '../services/EditClasseService';
import DeleteClasseService from '../services/DeleteClasseService';

export default class ClassesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const {
      id_leg,
      descricao_cla,
      valor_intermun_cla,
      valor_interesta_cla,
      valor_internac_cla,
      situacao_cla,
    } = request.body;
    const createClasseService = container.resolve(CreateClasseService);

    const classeCreated = await createClasseService.execute({
      id_leg,
      descricao_cla,
      valor_intermun_cla,
      valor_interesta_cla,
      valor_internac_cla,
      situacao_cla,
      id_usuario,
    });

    return response.json(classeCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, id_leg, query } = request.query;
    const showListClasse = container.resolve(ListClasseService);

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const listClasse = await showListClasse.execute(
      pageNumber,
      perPageNumber,
      Number(id_leg),
      query ? String(query) : undefined,
    );

    return response.status(200).json(listClasse);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateClasseService = container.resolve(EditClasseService);

    const data = {
      id_cla: Number(id),
      id_leg: body.legislacaoClasse,
      id_usuario,
      descricao_cla: body.nomeClasse,
      valor_intermun_cla: body.valorIntermunClasse,
      valor_interesta_cla: body.valorInterestaClasse,
      valor_internac_cla: body.valorInternClasse,
      situacao_cla: body.situacaoClasse,
      usuario_alteracao: id_usuario,
    };

    const classe = await updateClasseService.execute(data);

    return response.status(200).json(classe);
  }

  public async softDelete(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateClasseService = container.resolve(DeleteClasseService);

    const data = {
      id_cla: Number(id),
      usuario_alteracao: id_usuario,
      ...body,
    };

    const classe = await updateClasseService.execute(data);

    return response.status(200).json(classe);
  }
}
