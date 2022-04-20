import { getRepository, Repository } from 'typeorm';
import ICreateClasseCargoDTO from '../dtos/ICreateClasseCargoDTO';
import IUpdateClasseCargoDTO from '../dtos/IUpdateClasseCargoDTO';
import ClasseCargo from '../entities/ClasseCargo';
import VListaPostoClasseCargo from '../entities/VListaPostoClasseCargo';

import IClassesCargoRepository from './interfaces/IClassesCargoRepository';

class ClassesCargoRepository implements IClassesCargoRepository {
  private classeCargoRepository: Repository<ClasseCargo>;

  private postoClasseCargoRepository: Repository<VListaPostoClasseCargo>;

  constructor() {
    this.classeCargoRepository = getRepository(ClasseCargo);
    this.postoClasseCargoRepository = getRepository(VListaPostoClasseCargo);
  }

  public async create({
    id_cla,
    codigo_cargo,
    id_leg,
    tipific_cargo,
    situacao_cla_car,
    usuario_cadastro,
  }: ICreateClasseCargoDTO): Promise<ClasseCargo> {
    const classeCargo = this.classeCargoRepository.create({
      id_cla,
      codigo_cargo,
      id_leg,
      tipific_cargo,
      situacao_cla_car,
      usuario_cadastro,
      data_cadastro: new Date(),
    });

    const novaClasseCargo = await this.classeCargoRepository.save(classeCargo);

    return novaClasseCargo;
  }

  public async findTipoClasseCargo(
    idClasse: number,
    codigoCargo: number,
    idLeg: number,
    tipificCargo: string,
  ): Promise<ClasseCargo | undefined> {
    return this.classeCargoRepository.findOne({
      where: {
        id_cla: idClasse,
        codigo_cargo: codigoCargo,
        id_leg: idLeg,
        tipific_cargo: tipificCargo,
        deletado_cla_car: 0,
      },
    });
  }

  public async listClasseCargo(
    page: number,
    perPage: number,
    id_cla?: number,
    id_leg?: number,
  ): Promise<{ classesCargo: ClasseCargo[]; total: number }> {
    let wherePersonalizado = [];

    wherePersonalizado = [
      {
        deletado_cla_car: 0,
      },
    ];

    const [consulta, total] = await this.classeCargoRepository.findAndCount({
      join: {
        alias: 'classesCargo',
        leftJoinAndSelect: {
          classe: 'classesCargo.classe',
          legislacao: 'classesCargo.legislacao',
        },
      },
      where: wherePersonalizado,
      order: {
        id_cla_car: 'ASC',
      },

      skip: page * perPage - perPage,
      take: perPage,
    });

    return { classesCargo: consulta, total };
  }

  public async findIdsTipoClasseCargo(
    tipific_cargo: string,
  ): Promise<{ postosCargos: VListaPostoClasseCargo[] }> {
    const consulta = await this.postoClasseCargoRepository.find({
      where: {
        tipo: tipific_cargo,
      },
    });

    return { postosCargos: consulta };
  }

  public async update(
    classeCargo: ClasseCargo,
    newData: IUpdateClasseCargoDTO,
  ): Promise<ClasseCargo> {
    const classeCargoUpdate = await this.classeCargoRepository.merge(
      classeCargo,
      {
        data_alteracao: new Date(),
        ...newData,
      },
    );

    await this.classeCargoRepository.save(classeCargoUpdate);

    return classeCargoUpdate;
  }

  public async findById(id: number): Promise<ClasseCargo | undefined> {
    const classeCargo = await this.classeCargoRepository.findOne({
      where: {
        id_cla_car: id,
        deletado_cla_car: 0,
      },
    });

    return classeCargo;
  }
}

export default ClassesCargoRepository;
