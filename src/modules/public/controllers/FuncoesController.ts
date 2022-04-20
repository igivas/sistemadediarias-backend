import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListFuncaoService from '../services/ListFuncaoService';

export default class FuncoesController {
  public async listFuncoes(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { codigo } = request.params;
    const listFuncoesService = container.resolve(ListFuncaoService);

    const funcoes = await listFuncoesService.execute(Number(codigo));

    return response.status(200).json(funcoes);
  }
}
