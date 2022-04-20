import { getRepository } from 'typeorm';
import VListaCredor from '../entities/VListaCredor';
import IVListaCredorRepository from './interfaces/IVListaCredorRepository';

class VListaCredorRepository implements IVListaCredorRepository {
  constructor(private ormRepository = getRepository(VListaCredor)) {}

  async findCredor(dadosCredores: string): Promise<VListaCredor[]> {
    const querySearch = this.ormRepository.createQueryBuilder('credores');

    querySearch.where(`credores.dados ILIKE :query`, {
      query: `%${dadosCredores}%`,
    });

    querySearch.take(10);

    return querySearch.getMany();
  }
}

export default VListaCredorRepository;
