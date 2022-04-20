import { getRepository, Raw, Repository } from 'typeorm';
import ICreateClasseDTO from '../dtos/ICreateClasseDTO';
import IDeleteClasseDTO from '../dtos/IDeleteClasseDTO';
import IUpdateClasseDTO from '../dtos/IUpdateClasseDTO';
import Classe from '../entities/Classes';
import IClassesRepository from './interfaces/IClassesRepository';

class ClassesRepository implements IClassesRepository {
  private classeRepository: Repository<Classe>;

  constructor() {
    this.classeRepository = getRepository(Classe);
  }

  public async findByNome(nome: string): Promise<Classe | undefined> {
    return this.classeRepository.findOne({
      where: {
        descricao_cla: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
      },
    });
  }

  public async create({
    id_leg,
    descricao_cla,
    valor_intermun_cla,
    valor_interesta_cla,
    valor_internac_cla,
    usuario_cadastro,
    situacao_cla,
  }: ICreateClasseDTO): Promise<Classe> {
    const classe = this.classeRepository.create({
      id_leg,
      descricao_cla,
      valor_intermun_cla,
      valor_interesta_cla,
      valor_internac_cla,
      usuario_cadastro,
      situacao_cla,
      data_cadastro: new Date(),
    });

    const novaClasse = await this.classeRepository.save(classe);

    return novaClasse;
  }

  public async listClasse(
    page: number,
    perPage: number,
    id_leg?: number,
    query?: string,
  ): Promise<{ classes: Classe[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      wherePersonalizado = [
        {
          descricao_cla: Raw(
            nomeClasse => `LOWER(${nomeClasse}) ILIKE '%${query}%'`,
          ),
          deletado_cla: 0,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          deletado_cla: 0,
        },
      ];
    }
    const [consulta, total] = await this.classeRepository.findAndCount({
      join: {
        alias: 'classes',
        leftJoinAndSelect: {
          legislacao: 'classes.legislacao',
        },
      },
      where: wherePersonalizado,
      order: {
        id_cla: 'ASC',
      },

      skip: page * perPage - perPage,
      take: perPage,
    });

    return { classes: consulta, total };
  }

  public async update(
    classe: Classe,
    newData: IUpdateClasseDTO,
  ): Promise<Classe> {
    const classeUpdate = this.classeRepository.merge(classe, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.classeRepository.save(classeUpdate);

    return classeUpdate;
  }

  public async findById(id: number): Promise<Classe | undefined> {
    const classe = await this.classeRepository.findOne({
      where: {
        id_cla: id,
        deletado_cla: 0,
      },
    });

    return classe;
  }

  public async softDelete(
    classe: Classe,
    newData: IDeleteClasseDTO,
  ): Promise<Classe> {
    const classeUpdate = this.classeRepository.merge(classe, {
      deletado_cla: 1,
      data_alteracao: new Date(),
      usuario_alteracao: newData.usuario_alteracao,
    });

    await this.classeRepository.save(classeUpdate);

    return classeUpdate;
  }
}

export default ClassesRepository;
