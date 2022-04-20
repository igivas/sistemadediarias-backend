import VPolicialECivil from '../../entities/VPolicialECivil';

export default interface IGraduacoesRepository {
  findByQuery(
    query: string | undefined,
    idsOpms: number[],
  ): Promise<VPolicialECivil[] | undefined>;
}
