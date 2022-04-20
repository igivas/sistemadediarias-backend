import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateClasseCargoService from '../services/CreateClasseCargoService';
import EditClasseCargoService from '../services/EditClasseCargoService';
import ListClasseCargoService from '../services/ListClasseCargoService';
import ListPostoClasseCargoService from '../services/ListPostoClasseCargoService';

export default class ClassesCargoController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const {
      id_cla,
      codigo_cargo,
      id_leg,
      tipific_cargo,
      situacao_cla_car,
    } = request.body;
    const createClasseCargoService = container.resolve(
      CreateClasseCargoService,
    );

    const classeCargoCreated = await createClasseCargoService.execute({
      id_cla,
      codigo_cargo,
      id_leg,
      tipific_cargo,
      situacao_cla_car,
      id_usuario,
    });

    return response.json(classeCargoCreated);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { page, perPage, id_leg, id_cla } = request.query;
    const showListClasseCargo = container.resolve(ListClasseCargoService);

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const listClasseCargo = await showListClasseCargo.execute(
      pageNumber,
      perPageNumber,
      id_cla ? Number(id_cla) : undefined,
      id_leg ? Number(id_leg) : undefined,
    );

    return response.status(200).json(listClasseCargo);
  }

  public async listCargos(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { tipific_cargo } = request.params;
    const listarPostoClasseCargoService = container.resolve(
      ListPostoClasseCargoService,
    );

    const postos = await listarPostoClasseCargoService.execute(tipific_cargo);

    return response.status(200).json(postos);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateClasseCargoService = container.resolve(EditClasseCargoService);

    const data = {
      id_cla_car: Number(id),
      id_cla: body.classeCargo,
      codigo_cargo: body.codigoClasseCargo,
      id_leg: body.legislacaoClasseCargo,
      tipific_cargo: body.tipoClasseCargo,
      situacao_cla_car: body.situacaoClasseCargo,
      id_usuario,
      usuario_alteracao: id_usuario,
    };

    const classeCargo = await updateClasseCargoService.execute(data);

    return response.status(200).json(classeCargo);
  }
}
