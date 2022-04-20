import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EditCredorService from '../services/EditCredorService';
import ListCredorService from '../services/ListCredorService';

export default class CredoresController {
  public async listCredor(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { dados } = request.params;

    const listarCredorService = container.resolve(ListCredorService);

    const credores = await listarCredorService.execute(dados);

    return response.status(200).json(credores);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { matricula } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const editCredorService = container.resolve(EditCredorService);

    const data = {
      pm_codigo: matricula,
      pm_num_credor: body.numCredorPm,
      usuario_alteracao: id_usuario,
    };

    const pms = await editCredorService.execute(data);

    return response.status(200).json(pms);
  }
}
