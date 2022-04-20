import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateLinksService from '../services/CreateLinkService';
import CheckLinkService from '../services/CheckLinkService';

export default class LinksController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id_validacao } = request.body;
    const { id_usuario } = request.user;
    const createLinksService = container.resolve(CreateLinksService);

    const link = await createLinksService.execute(
      Number(id_validacao),
      String(id_usuario),
    );

    return response.json(classToClass(link));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const checkLinksService = container.resolve(CheckLinkService);

    await checkLinksService.execute(String(token));

    return response.status(204).json();
  }
}
