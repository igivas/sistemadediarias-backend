import { getRepository } from 'typeorm';
import VListaMunicipios from '../entities/VListaMunicipios';
import IVListaMunicipiosRepository from './interfaces/IVListaMunicipiosRepository';

class VListaMunicipiosRepository implements IVListaMunicipiosRepository {
  constructor(private ormRepository = getRepository(VListaMunicipios)) {}

  async findUf(siglaUf: string): Promise<VListaMunicipios[]> {
    const querySearch = this.ormRepository.createQueryBuilder('siglaestado');

    querySearch.where('siglaestado.sigla_estado = :siglaUf', { siglaUf });

    return querySearch.getMany();
  }
}

export default VListaMunicipiosRepository;
