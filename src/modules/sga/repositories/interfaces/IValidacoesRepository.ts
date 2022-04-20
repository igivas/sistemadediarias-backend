import Validacao from '../../entities/Validacao';
import ICreateValidacoesDTO from '../../dtos/ICreateValidacoesDTO';

interface IResponseFindValidacoes {
  total: number;
  totalPage: number;
  items: object[];
}

export default interface IValidacoesRepository {
  findValidacaoAnteriorByCpf(cpf: string): Promise<Validacao | undefined>;
  findValidacaoAtualByCpf(cpf: string): Promise<Validacao | undefined>;
  findValidacaoAtualByPesCodigo(
    pes_codigo: string,
  ): Promise<Validacao | undefined>;
  findValidacoesAtivasOuPendentesByCpfs(
    cpfs: string[],
  ): Promise<Validacao[] | undefined>;
  countValidacoesAtivasByCpfs(cpfs: string[]): Promise<number | undefined>;
  findValidacoesByCpfs(
    cpfs: string[],
    page: number,
    perPage: number,
    sortfields?: string | undefined,
    sorts?: string | undefined,
  ): Promise<IResponseFindValidacoes | undefined>;
  findById(id: number): Promise<Validacao | undefined>;
  findAllByStatus(query: string): Promise<Validacao[] | undefined>;
  findPendente(id: number): Promise<Validacao | undefined>;
  findPendenteByCpf(cpf: string): Promise<Validacao | undefined>;
  findPendenteOrAtualByCpf(cpf: string): Promise<Validacao[] | undefined>;
  create(data: ICreateValidacoesDTO): Promise<Validacao>;
  update(validacao: any, newData: any): Promise<Validacao>;
}
