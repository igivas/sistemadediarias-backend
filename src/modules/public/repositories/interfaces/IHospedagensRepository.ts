import IDeleteHospedagemDTO from '../../dtos/IDeleteHospedagemDTO';
import IUpdateHospedagemDTO from '../../dtos/IUpdateHospedagemDTO';
import ICreateHospedagemDTO from '../../dtos/ICreateHospedagemDTO';
import Hospedagem from '../../entities/Hospedagem';

export default interface IHospedagensRepository {
  create(data: ICreateHospedagemDTO): Promise<Hospedagem>;

  listHospedagem(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ hospedagens: Hospedagem[]; total: number }>;

  findByNome(descricao_hosp: string): Promise<Hospedagem | undefined>;

  update(
    hospedagem: Hospedagem,
    newData: IUpdateHospedagemDTO,
  ): Promise<Hospedagem>;

  findById(id: number): Promise<Hospedagem | undefined>;

  softDelete(
    hospedagem: Hospedagem,
    newData: IDeleteHospedagemDTO,
  ): Promise<Hospedagem>;
}
