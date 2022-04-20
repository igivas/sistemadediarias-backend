import { getRepository, ILike, In, Repository, Raw } from 'typeorm';
import IUnidadesRepository from './interfaces/IUnidadesRepository';
import Unidade from '../entities/Unidade';

class UnidadesRepository implements IUnidadesRepository {
  private ormRepository: Repository<Unidade>;

  constructor() {
    this.ormRepository = getRepository(Unidade);
  }

  public async findById(id: number): Promise<Unidade | undefined> {
    const unidade = await this.ormRepository.findOne(id, {
      relations: ['municipio'],
    });

    return unidade;
  }

  public async listAsyncSelect(
    query: string,
  ): Promise<{ unidades: Unidade[] }> {
    let wherePersonalizado = [];
    if (query) {
      wherePersonalizado = [
        {
          uni_sigla: Raw(
            nomeCategoria => `LOWER(${nomeCategoria}) ILIKE '%${query}%'`,
          ),
          uni_lob: 2021,
        },
      ];
    } else {
      wherePersonalizado = [];
    }

    const [consulta, total] = await this.ormRepository.findAndCount({
      where: wherePersonalizado,
    });
    return { unidades: consulta };
  }

  public async findSubunidades(
    unidade: number,
  ): Promise<Unidade[] | undefined> {
    const unidades = await this.ormRepository.find({
      where: [
        {
          uni_superior: unidade,
        },
        {
          uni_grd_cmdo: unidade,
        },
      ],
    });

    return unidades;
  }

  public async findUnidades(
    query: string | undefined,
    ids: number[],
  ): Promise<Unidade[] | undefined> {
    const unidades = await this.ormRepository.find({
      select: ['uni_codigo', 'uni_sigla'],
      where: { uni_sigla: ILike(`%${query}%`), uni_codigo: In(ids) },
    });

    return unidades;
  }

  public async findByIds(ids: number[]): Promise<Unidade[] | undefined> {
    const unidades = await this.ormRepository.findByIds(ids, {
      select: ['uni_codigo', 'uni_sigla'],
    });

    return unidades;
  }
}

export default UnidadesRepository;
