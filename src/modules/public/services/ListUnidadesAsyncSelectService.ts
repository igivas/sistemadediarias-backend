import { injectable, inject } from 'tsyringe';
import IUnidadesRepository from '../repositories/interfaces/IUnidadesRepository';
import Unidade from '../entities/Unidade';

@injectable()
class ListUnidadesAsyncSelectService {
  constructor(
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,
  ) {}

  public async execute(
    query: string | undefined,
  ): Promise<Unidade[] | undefined> {
    const unidades = await this.unidadesRepository.listAsyncSelect(query);

    return unidades;
  }
}

export default ListUnidadesAsyncSelectService;
