import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreatePinService from '../services/CreatePinService';

export default class PinsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { pes_codigo } = request.body;

    const createPinService = container.resolve(CreatePinService);

    const { email } = await createPinService.execute(pes_codigo);

    return response.status(200).json({
      status: 'success',
      statusCode: 200,
      message: `Um novo PIN temporário foi enviado para o email: ${email}!`,
    });
  }
}
