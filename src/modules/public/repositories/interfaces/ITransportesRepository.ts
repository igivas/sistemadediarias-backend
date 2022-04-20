import IDeleteTransporteDTO from '@modules/public/dtos/IDeleteTransporte';
import IUpdateTransporteDTO from '@modules/public/dtos/IUpdateTransporteDTO';
import ICreateTransporteDTO from '../../dtos/ICreateTransporteDTO';
import Transporte from '../../entities/Transporte';

export default interface ITransportesRepository {
  create(data: ICreateTransporteDTO): Promise<Transporte>;

  listTransporte(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ transportes: Transporte[]; total: number }>;

  findByNome(descricao_tran: string): Promise<Transporte | undefined>;

  findById(id: number): Promise<Transporte | undefined>;

  update(
    transporte: Transporte,
    newData: IUpdateTransporteDTO,
  ): Promise<Transporte>;

  softDelete(
    transporte: Transporte,
    newData: IDeleteTransporteDTO,
  ): Promise<Transporte>;
}
