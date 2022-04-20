import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAssinaturaService from '../services/CreateAssinaturaService';
import AuthenticateAssinaturaService from '../services/AuthenticateAssinaturaService';
import AuthenticateNoPìnAssinaturaService from '../services/AuthenticateAssinaturaNoPinService';
import RevogaAssinaturaService from '../services/RevogaAssinaturaService';
import RevogaAssinaturaValidacaoService from '../services/RevogaAssinaturaValidacaoService';

export default class AssinaturasController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token, senha } = request.body;
    const createAssinaturaService = container.resolve(CreateAssinaturaService);

    const assinatura = await createAssinaturaService.execute(token, senha);

    return response.json(classToClass(assinatura));
  }

  public async updateRevoga(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id_validacao } = request.body;

    const revogaAssinaturaService = container.resolve(RevogaAssinaturaService);

    await revogaAssinaturaService.execute(Number(id_validacao));

    return response.status(204).json();
  }

  public async updateRevogaAssinaturaValidacao(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id_validacao } = request.body;
    const { id_usuario } = request.user;

    const revogaAssinaturaService = container.resolve(
      RevogaAssinaturaValidacaoService,
    );

    await revogaAssinaturaService.execute(Number(id_validacao), id_usuario);

    return response.status(204).json();
  }

  public async check(req: Request, res: Response): Promise<Response> {
    const { cpf_assinante, assinatura, pin } = req.body;

    const authenticateAssinatura = container.resolve(
      AuthenticateAssinaturaService,
    );

    await authenticateAssinatura.execute({
      cpf_assinante,
      assinatura,
      pin,
    });

    return res.status(204).json();
  }

  public async checkNoPin(req: Request, res: Response): Promise<Response> {
    const { cpf, assinatura } = req.body;

    const authenticateAssinatura = container.resolve(
      AuthenticateNoPìnAssinaturaService,
    );

    await authenticateAssinatura.execute({
      cpf_assinante: cpf,
      assinatura,
    });

    return res.status(204).json();
  }
}
