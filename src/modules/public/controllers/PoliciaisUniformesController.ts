import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Repository } from 'typeorm';

import PessoaUniforme from '../entities/PessoaUniforme';
import ShowPolicialUniformeService from '../services/ShowPolicialUniformeService';
import ListPolicialUniformebyOpmService from '../services/ListPolicialUniformebyOpmService';
import ListPolicialUniformebyOpmServicePendentes from '../services/ListPolicialUniformebyOpmServicePendentes';
import UpdatePolicialUniformeService from '../services/UpdateUniformePolicialService';
import ShowPolicialUniformebyIdService from '../services/ShowPolicialUniformeServicebyId';
import ListDashboardDataOpmService from '../services/ListDashboardDataOpmService';
import ListDashboardCologService from '../services/ListDashboardCologService';
import ListRelatorioQuantitativoService from '../services/ListRelatorioQuantitativoService';

export default class PoliciaisUniformesController {
  private PessoasUniformesRepository: Repository<PessoaUniforme>;

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id_usuario } = request.user;
    const { body } = request;
    const updateUniformeService = container.resolve(
      UpdatePolicialUniformeService,
    );

    const uniforme = await updateUniformeService.execute({
      peu_codigo: Number(id),
      id_usuario,
      ...body,
    });

    return response.status(200).json(uniforme);
  }

  /* public async create(request: Request, response: Response): Promise<Response> {
    const { id_usuario } = request.user;
    const { body } = request;
    const createEnderecoService = container.resolve(
      CreateEnderecoPolicialService,
    );

    const endereco = await createEnderecoService.execute({
      id_usuario,
      ...body,
    });

    return response.status(200).json(endereco);
  } */

  public async show(request: Request, response: Response): Promise<Response> {
    const { pes_codigo } = request.params;
    const showUniformeService = container.resolve(ShowPolicialUniformeService);
    const uniforme = await showUniformeService.execute(String(pes_codigo));

    return response.status(200).json(uniforme);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { opm } = request.params;
    const { page, perPage, subunidades, editou, query } = request.query;
    const showUniformeService = container.resolve(
      ListPolicialUniformebyOpmService,
    );

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const uniforme = await showUniformeService.execute(
      String(opm),
      pageNumber,
      perPageNumber,
      String(subunidades),
      editou ? String(editou) : undefined,
      query ? String(query) : undefined,
    );

    return response.status(200).json(uniforme);
  }

  public async indexPendentes(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { opm } = request.params;
    const { page, perPage, subunidades, query } = request.query;

    const showUniformeService = container.resolve(
      ListPolicialUniformebyOpmServicePendentes,
    );

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const uniforme = await showUniformeService.execute(
      String(opm),
      pageNumber,
      perPageNumber,
      String(subunidades),
      query ? String(query) : undefined,
    );

    return response.status(200).json(uniforme);
  }

  public async indexRelatorioQuantidades(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { opm } = request.params;
    const { page, perPage, subunidades, query } = request.query;

    const showUniformeService = container.resolve(
      ListRelatorioQuantitativoService,
    );

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    const uniforme = await showUniformeService.execute(
      String(opm),
      pageNumber,
      perPageNumber,
      String(subunidades),
      query ? String(query) : undefined,
    );

    return response.status(200).json(uniforme);
  }

  public async indexDashboardOpm(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { opm } = request.params;
    const { subunidades } = request.query;

    const listUniformes = container.resolve(ListDashboardDataOpmService);

    const uniformes = await listUniformes.execute(
      String(opm),
      String(subunidades),
    );

    return response.status(200).json(uniformes);
  }

  public async indexDashboardColog(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const listUniformes = container.resolve(ListDashboardCologService);

    const uniformes = await listUniformes.execute();

    return response.status(200).json(uniformes);
  }

  public async showbyId(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const showUniformeService = container.resolve(
      ShowPolicialUniformebyIdService,
    );

    const uniforme = await showUniformeService.execute(Number(id));

    return response.status(200).json(uniforme);
  }
}
