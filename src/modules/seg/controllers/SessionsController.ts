import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/seg/services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { matricula, senha } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { usuario, token } = await authenticateUser.execute({
      matricula,
      senha,
    });

    return res.json({ user: classToClass(usuario), token });
  }
}
