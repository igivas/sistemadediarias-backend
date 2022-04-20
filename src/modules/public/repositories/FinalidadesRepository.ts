import { getRepository, Repository, Raw } from 'typeorm';

import ICreateFinalidadeDTO from '../dtos/ICreateFinalidadeDTO';
import IDeleteFinalidadeDTO from '../dtos/IDeleteFinalidadeDTO';
import IUpdateFinalidadeDTO from '../dtos/IUpdateFinalidadeDTO';
import Finalidade from '../entities/Finalidade';
import IFinalidadesRepository from './interfaces/IFinalidadesRepository';

class FinalidadesRepository implements IFinalidadesRepository {
  private finalidadeRepository: Repository<Finalidade>;

  constructor() {
    this.finalidadeRepository = getRepository(Finalidade);
  }

  public async findByNome(nome: string): Promise<Finalidade | undefined> {
    return this.finalidadeRepository.findOne({
      where: {
        descricao_fin: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
        deletado_fin: 0,
      },
    });
  }

  public async create({
    descricao_fin,
    situacao_fin,
    usuario_cadastro,
  }: ICreateFinalidadeDTO): Promise<Finalidade> {
    const finalidade = this.finalidadeRepository.create({
      descricao_fin,
      situacao_fin,
      usuario_cadastro,
      data_cadastro: new Date(),
    });

    const novaFinalidade = await this.finalidadeRepository.save(finalidade);

    return novaFinalidade;
  }

  public async listFinalidade(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ finalidades: Finalidade[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      wherePersonalizado = [
        {
          descricao_fin: Raw(
            nomeFinalidade => `LOWER(${nomeFinalidade}) ILIKE '%${query}%'`,
          ),
          deletado_fin: 0,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          deletado_fin: 0,
        },
      ];
    }

    const [consulta, total] = await this.finalidadeRepository.findAndCount({
      where: wherePersonalizado,
      order: {
        id_fin: 'ASC',
      },
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { finalidades: consulta, total };
  }

  public async update(
    finalidade: Finalidade,
    newData: IUpdateFinalidadeDTO,
  ): Promise<Finalidade> {
    const finalidadeUpdate = this.finalidadeRepository.merge(finalidade, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.finalidadeRepository.save(finalidadeUpdate);

    return finalidadeUpdate;
  }

  public async softDelete(
    finalidade: Finalidade,
    newData: IDeleteFinalidadeDTO,
  ): Promise<Finalidade> {
    const finalidadeUpdate = this.finalidadeRepository.merge(finalidade, {
      deletado_fin: 1,
      data_alteracao: new Date(),
      usuario_alteracao: newData.usuario_alteracao,
    });

    await this.finalidadeRepository.save(finalidadeUpdate);

    return finalidadeUpdate;
  }

  public async findById(id: number): Promise<Finalidade | undefined> {
    const finalidade = await this.finalidadeRepository.findOne({
      where: {
        id_fin: id,
        deletado_fin: 0,
      },
    });

    return finalidade;
  }
}

export default FinalidadesRepository;
