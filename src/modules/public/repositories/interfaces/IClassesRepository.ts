import IDeleteClasseDTO from '@modules/public/dtos/IDeleteClasseDTO';
import IUpdateClasseDTO from '@modules/public/dtos/IUpdateClasseDTO';

import ICreateClasseDTO from '../../dtos/ICreateClasseDTO';
import Classe from '../../entities/Classes';

export default interface IClassesRepository {
  create(data: ICreateClasseDTO): Promise<Classe>;

  listClasse(
    page: number,
    perPage: number,
    id_leg?: number,
    query?: string,
  ): Promise<{ classes: Classe[]; total: number }>;

  findByNome(descricao_cla: string): Promise<Classe | undefined>;

  findById(id: number): Promise<Classe | undefined>;

  update(classe: Classe, newData: IUpdateClasseDTO): Promise<Classe>;

  softDelete(classe: Classe, newData: IDeleteClasseDTO): Promise<Classe>;
}
