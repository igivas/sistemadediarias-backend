import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPoliciaisECivisService from '../services/ListPoliciaisECivisService';

export default class PoliciaisECivisController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { query } = request.query;
    const { id_usuario, opm } = request.user;
    const listService = container.resolve(ListPoliciaisECivisService);

    const pessoas = await listService.execute(
      String(query),
      String(id_usuario),
      Number(opm),
    );

    return response.json(pessoas);
  }
}
