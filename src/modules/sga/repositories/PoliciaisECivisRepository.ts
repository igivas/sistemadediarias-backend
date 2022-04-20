import { getRepository, In, IsNull, Not, Raw, Repository } from 'typeorm';
import IPoliciaisECivisRepository from './interfaces/IPoliciaisECivisRepository';
import VPolicialECivil from '../entities/VPolicialECivil';

class PessoasFisicasPmsRepository implements IPoliciaisECivisRepository {
  private ormRepository: Repository<VPolicialECivil>;

  constructor() {
    this.ormRepository = getRepository(VPolicialECivil);
  }

  public async findByQuery(
    query: string,
    idsOpms: number[],
  ): Promise<VPolicialECivil[] | undefined> {
    // const isPmce = idsOpms.includes(-1);

    const customWhere = [
      {
        dados: Raw(dados => `LOWER(${dados}) ILIKE '%${query}%'`),
        // uni_codigo: isPmce ? Not(IsNull()) : In(idsOpms),
      },
      {
        dados: Raw(dados => `LOWER(${dados}) ILIKE '%${query}%'`),
        // uni_superior: isPmce ? Not(IsNull()) : In(idsOpms),
      },
      {
        dados: Raw(dados => `LOWER(${dados}) ILIKE '%${query}%'`),
        // uni_grd_cmdo: isPmce ? Not(IsNull()) : In(idsOpms),
      },
    ];
    const policiais = await this.ormRepository.find({
      where: customWhere,
      take: 15,
    });

    return policiais;
  }
}

export default PessoasFisicasPmsRepository;
