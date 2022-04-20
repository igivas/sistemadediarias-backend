import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListOpmsService from '../services/ListOpmsService';

export default class OpmsController {
  public async listOpms(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { unidade } = request.params;
    const listOpmsService = container.resolve(ListOpmsService);

    const opms = await listOpmsService.execute(unidade);

    return response.status(200).json(opms);
  }
}
