import { getRepository, Raw, Repository } from 'typeorm';
import ICreateHospedagemDTO from '../dtos/ICreateHospedagemDTO';
import IDeleteHospedagemDTO from '../dtos/IDeleteHospedagemDTO';
import IUpdateHospedagemDTO from '../dtos/IUpdateHospedagemDTO';
import Hospedagem from '../entities/Hospedagem';
import IHospedagensRepository from './interfaces/IHospedagensRepository';

class HospedagensRepository implements IHospedagensRepository {
  private hospedagemRepository: Repository<Hospedagem>;

  constructor() {
    this.hospedagemRepository = getRepository(Hospedagem);
  }

  public async findByNome(nome: string): Promise<Hospedagem | undefined> {
    return this.hospedagemRepository.findOne({
      where: {
        descricao_hosp: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
      },
    });
  }

  public async create({
    descricao_hosp,
    situacao_hosp,
    usuario_cadastro,
  }: ICreateHospedagemDTO): Promise<Hospedagem> {
    const hospedagem = this.hospedagemRepository.create({
      descricao_hosp,
      situacao_hosp,
      usuario_cadastro,
      data_cadastro: new Date(),
    });

    const novaHospedagem = await this.hospedagemRepository.save(hospedagem);

    return novaHospedagem;
  }

  public async listHospedagem(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ hospedagens: Hospedagem[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      wherePersonalizado = [
        {
          descricao_hosp: Raw(
            nomeHospedagem => `LOWER(${nomeHospedagem}) ILIKE '%${query}%'`,
          ),
          deletado_hosp: 0,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          deletado_hosp: 0,
        },
      ];
    }

    const [consulta, total] = await this.hospedagemRepository.findAndCount({
      where: wherePersonalizado,
      order: {
        id_hosp: 'ASC',
      },
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { hospedagens: consulta, total };
  }

  public async update(
    hospedagem: Hospedagem,
    newData: IUpdateHospedagemDTO,
  ): Promise<Hospedagem> {
    const hospedagemUpdate = this.hospedagemRepository.merge(hospedagem, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.hospedagemRepository.save(hospedagemUpdate);

    return hospedagemUpdate;
  }

  public async softDelete(
    hospedagem: Hospedagem,
    newData: IDeleteHospedagemDTO,
  ): Promise<Hospedagem> {
    const hospedagemUpdate = this.hospedagemRepository.merge(hospedagem, {
      deletado_hosp: 1,
      data_alteracao: new Date(),
      usuario_alteracao: newData.usuario_alteracao,
    });

    await this.hospedagemRepository.save(hospedagemUpdate);

    return hospedagemUpdate;
  }

  public async findById(id: number): Promise<Hospedagem | undefined> {
    const hospedagem = await this.hospedagemRepository.findOne({
      where: {
        id_hosp: id,
        deletado_hosp: 0,
      },
    });

    return hospedagem;
  }
}

export default HospedagensRepository;
