import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Transporte from '../entities/Transporte';
import ITransportesRepository from '../repositories/interfaces/ITransportesRepository';

@injectable()
class ListTransporteService {
  constructor(
    @inject('TransportesRepository')
    private transporteRepository: ITransportesRepository,
  ) {}

  public async execute(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ items: Transporte[]; total: number; totalPage: number }> {
    const {
      transportes: items,
      total,
    } = await this.transporteRepository.listTransporte(page, perPage, query);

    if (!items) {
      throw new AppError('Nenhum registro cadastrado!', 404);
    }
    return {
      totalPage: Math.ceil(total / Number(perPage)),
      total,
      items,
    };
  }
}

export default ListTransporteService;
