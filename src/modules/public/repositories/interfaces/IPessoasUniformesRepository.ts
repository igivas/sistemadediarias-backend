import PessoaUniforme from '@modules/public/entities/PessoaUniforme';
import VRelatorioQuantitativo from '@modules/public/entities/VRelatorioQuantitativo';
import IUpdateUniformeDTO from '../../dtos/IUpdateUniformeDTO';

export default interface IPessoasUniformesRepository {
  ListDashboardDataOpm(
    opm: string,
    subunidades: string,
  ): Promise<PessoaUniforme[]>;
  ListDashboardDataColog(): Promise<PessoaUniforme[]>;

  findById(id: number): Promise<PessoaUniforme | undefined>;
  ListPendentes(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
    query?: string,
  ): Promise<{ uniformes: any[]; total: number }>;
  List(
    opm: string,
    page?: number,
    perPage?: number,
    subunidades?: string,
    editou?: string,
    query?: string,
  ): Promise<{ uniformes: PessoaUniforme[]; total: number }>;

  ListRelatorioQuantitativo(
    opm: string,
    page?: number,
    perPage?: number,
    subunidades?: string,
    query?: string,
  ): Promise<{ dados: any[]; total: number }>;

  findByIdSemRel(id: number): Promise<PessoaUniforme | undefined>;

  findByPesCodigo(pes_codigo: string): Promise<PessoaUniforme[]>;

  update(
    uniforme: PessoaUniforme,
    newData: IUpdateUniformeDTO,
  ): Promise<PessoaUniforme>;
  // create(endereco: ICreateEnderecoDTO): Promise<PessoaEndereco>;
}
