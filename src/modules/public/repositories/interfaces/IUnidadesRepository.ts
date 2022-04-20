import Unidade from '../../entities/Unidade';

export default interface IUnidadesRepository {
  findById(id: number): Promise<Unidade | undefined>;
  findSubunidades(unidade: number): Promise<Unidade[] | undefined>;
  findUnidades(
    query: string | undefined,
    ids: number[],
  ): Promise<Unidade[] | undefined>;
  findByIds(ids: number[]): Promise<Unidade[] | undefined>;
  listAsyncSelect(query: string): Promise<{ unidades: Unidade[] }>;
}
