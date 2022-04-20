import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUnidadesUsuarioService from '../services/ListUnidadesUsuarioService';
import ListUnidadesAsyncSelectService from '../services/ListUnidadesAsyncSelectService';

export default class UnidadesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query, opm_usuario } = request.query;
    const { id_usuario } = request.user;
    const listService = container.resolve(ListUnidadesUsuarioService);

    const unidades = await listService.execute(
      query ? String(query) : undefined,
      String(id_usuario),
      Number(opm_usuario),
    );

    return response.json(unidades);
  }

  public async AsyncSelect(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { query } = request.query;

    const listService = container.resolve(ListUnidadesAsyncSelectService);

    const unidades = await listService.execute(
      query ? String(query) : undefined,
    );

    return response.json(unidades);
  }
}
