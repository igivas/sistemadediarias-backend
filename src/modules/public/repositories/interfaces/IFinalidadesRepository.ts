import IDeleteFinalidadeDTO from '../../dtos/IDeleteFinalidadeDTO';
import IUpdateFinalidadeDTO from '../../dtos/IUpdateFinalidadeDTO';
import ICreateFinalidadeDTO from '../../dtos/ICreateFinalidadeDTO';
import Finalidade from '../../entities/Finalidade';

export default interface IFinalidadesRepository {
  create(data: ICreateFinalidadeDTO): Promise<Finalidade>;

  listFinalidade(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ finalidades: Finalidade[]; total: number }>;

  update(
    finalidade: Finalidade,
    newData: IUpdateFinalidadeDTO,
  ): Promise<Finalidade>;

  findByNome(descricao_fin: string): Promise<Finalidade | undefined>;

  findById(id: number): Promise<Finalidade | undefined>;

  softDelete(
    finalidade: Finalidade,
    newData: IDeleteFinalidadeDTO,
  ): Promise<Finalidade>;
}
