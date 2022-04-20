import { getRepository, Repository, Raw } from 'typeorm';

import ICreateLegislacaoDTO from '../dtos/ICreateLegislacaoDTO';
import IDeleteLegislacaoDTO from '../dtos/IDeleteLegislacaoDTO';
import IUpdateLegislacaoDTO from '../dtos/IUpdateLegislacaoDTO';
import Legislacao from '../entities/Legislacao';
import ILegislacoesRepository from './interfaces/ILegislacoesRepository';

class LegislacoesRepository implements ILegislacoesRepository {
  private legislacaoRepository: Repository<Legislacao>;

  constructor() {
    this.legislacaoRepository = getRepository(Legislacao);
  }

  public async findByNome(nome: string): Promise<Legislacao | undefined> {
    return this.legislacaoRepository.findOne({
      where: {
        decreto_leg: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
        deletado_leg: 0,
      },
    });
  }

  public async create(dados: ICreateLegislacaoDTO): Promise<Legislacao> {
    const legislacao = this.legislacaoRepository.create({
      data_cadastro: new Date(),
      ...dados,
    });

    await this.legislacaoRepository.save(legislacao);

    return legislacao;
  }

  public async listLegislacao(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ legislacoes: Legislacao[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      wherePersonalizado = [
        {
          decreto_leg: Raw(
            nomeLegislacao => `LOWER(${nomeLegislacao}) ILIKE '%${query}%'`,
          ),
          deletado_leg: 0,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          deletado_leg: 0,
        },
      ];
    }

    const [consulta, total] = await this.legislacaoRepository.findAndCount({
      where: wherePersonalizado,
      order: {
        id_leg: 'ASC',
      },
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { legislacoes: consulta, total };
  }

  public async update(
    legislacao: Legislacao,
    newData: IUpdateLegislacaoDTO,
  ): Promise<Legislacao> {
    const legislacaoUpdate = this.legislacaoRepository.merge(legislacao, {
      data_alteracao: new Date(),
      ...newData,
    });

    console.log(newData);

    await this.legislacaoRepository.save(legislacaoUpdate);

    return legislacaoUpdate;
  }

  public async softDelete(
    legislacao: Legislacao,
    newData: IDeleteLegislacaoDTO,
  ): Promise<Legislacao> {
    const legislacaoUpdate = this.legislacaoRepository.merge(legislacao, {
      deletado_leg: 1,
      data_alteracao: new Date(),
      usuario_alteracao: newData.usuario_alteracao,
    });

    await this.legislacaoRepository.save(legislacaoUpdate);

    return legislacaoUpdate;
  }

  public async findById(id: number): Promise<Legislacao | undefined> {
    const legislacao = await this.legislacaoRepository.findOne({
      where: {
        id_leg: id,
        deletado_leg: 0,
      },
    });

    return legislacao;
  }
}

export default LegislacoesRepository;
