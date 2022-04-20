import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListMunicipiosService from '../services/ListMunicipiosService';

export default class MunicipiosController {
  public async listMunicipios(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { sigla } = request.params;
    const listMunicipiosService = container.resolve(ListMunicipiosService);

    const municipios = await listMunicipiosService.execute(sigla);

    return response.status(200).json(municipios);
  }
}
