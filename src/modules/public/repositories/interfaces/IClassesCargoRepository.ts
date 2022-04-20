import IUpdateClasseCargoDTO from '@modules/public/dtos/IUpdateClasseCargoDTO';
import VListaPostoClasseCargo from '@modules/public/entities/VListaPostoClasseCargo';
import ICreateClasseCargoDTO from '../../dtos/ICreateClasseCargoDTO';
import ClasseCargo from '../../entities/ClasseCargo';

export default interface IClassesCargoRepository {
  create(data: ICreateClasseCargoDTO): Promise<ClasseCargo>;

  listClasseCargo(
    page: number,
    perPage: number,
    id_cla?: number,
    id_leg?: number,
  ): Promise<{ classesCargo: ClasseCargo[]; total: number }>;

  findTipoClasseCargo(
    id_cla: number,
    codigo_cargo: number,
    id_leg: number,
    tipific_cargo: string,
  ): Promise<ClasseCargo | undefined>;

  findIdsTipoClasseCargo(
    tipific_cargo: string,
  ): Promise<{ postosCargos: VListaPostoClasseCargo[] }>;

  findById(id: number): Promise<ClasseCargo | undefined>;

  update(
    classeCargo: ClasseCargo,
    newData: IUpdateClasseCargoDTO,
  ): Promise<ClasseCargo>;
}
