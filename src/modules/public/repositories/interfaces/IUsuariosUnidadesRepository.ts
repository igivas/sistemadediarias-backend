export default interface IUsuariosUnidadesRepository {
  findIdsUnidadesByPesCodigo(
    pes_codigo: string,
    sis_codigo: number,
  ): Promise<number[]>;
}
