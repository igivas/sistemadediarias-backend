import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CountService from '../services/CountService';

export default class CountsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { opm, subunidades } = request.query;
    const countService = container.resolve(CountService);

    const counts = await countService.execute(Number(opm), String(subunidades));

    return response.json(counts);
  }
}
