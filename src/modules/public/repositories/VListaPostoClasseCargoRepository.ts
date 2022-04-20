import { getRepository } from 'typeorm';
import VListaPostoClasseCargo from '../entities/VListaPostoClasseCargo';
import IVListaPostoClasseCargoRepository from './interfaces/IVListaPostoClasseCargoRepository';

class VListaPostoClasseCargoRepository
  implements IVListaPostoClasseCargoRepository {
  constructor(private ormRepository = getRepository(VListaPostoClasseCargo)) {}

  async findCargo(tipificCargo: string): Promise<VListaPostoClasseCargo[]> {
    const querySearch = this.ormRepository.createQueryBuilder('tiposcargos');

    querySearch.where('tiposcargos.tipo = :tipificCargo', { tipificCargo });

    return querySearch.getMany();
  }
}

export default VListaPostoClasseCargoRepository;
