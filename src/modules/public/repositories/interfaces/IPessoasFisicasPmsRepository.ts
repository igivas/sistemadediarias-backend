import PessoaFisicaPm from '../../entities/PessoaFisicaPm';
import PessoaEmail from '../../entities/PessoaEmail';
import VListaPoliciais from '../../entities/VListaPoliciais';

interface IResponseFindPoliciais {
  total: number;
  totalPage: number;
  items: PessoaFisicaPm[];
}

export default interface IPessoasPmsRepository {
  findUniformesByOpm(
    opm: string,
    page?: number,
    perPage?: number,
  ): Promise<PessoaFisicaPm[]>;
  findByQuery(
    query: string | undefined,
  ): Promise<VListaPoliciais[] | undefined>;
  findByOpm(
    opm: number,
    page: number,
    perPage: number,
    cpfsNaoBuscar: string[],
    sortfields?: string | undefined,
    sorts?: string | undefined,
  ): Promise<IResponseFindPoliciais | undefined>;
  findCpfsByOpm(uni_codigo: number): Promise<string[] | undefined>;
  findByMatricula(matricula: string): Promise<PessoaFisicaPm | undefined>;
  findByCpf(cpf: string): Promise<PessoaFisicaPm | undefined>;
  findByPesCodigo(pes_codigo: string): Promise<PessoaFisicaPm | undefined>;
  findEmailByPesCodigoAndEmail(
    pes_codigo: string,
    email: string,
  ): Promise<PessoaEmail | undefined>;
  findFullByMatricula(matricula: string): Promise<any>;
  updateImage(
    pm_codigo: string,
    file: Buffer,
    usuario_alteracao: string,
  ): Promise<void>;
}
