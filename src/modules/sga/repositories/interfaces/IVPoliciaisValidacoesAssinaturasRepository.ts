import VPolicialValidacaoAssinatura from '@modules/sga/entities/VPolicialValidacaoAssinatura';

interface IResponseFindPoliciais {
  total: number;
  totalPage: number;
  items: VPolicialValidacaoAssinatura[];
}

export default interface IValidacoesRepository {
  findByOpm(
    opm: number,
    page: number,
    perPage: number,
    sortfields?: string | undefined,
    sorts?: string | undefined,
    query?: string | undefined,
    subunidades?: string,
    validacao?: string | undefined,
    assinatura?: string | undefined,
  ): Promise<IResponseFindPoliciais | undefined>;

  countAssinaturasValidacoes(
    opm: number,
    subunidades: string,
  ): Promise<{ total: number; assinaturas: number; validacoes: number }>;
}
