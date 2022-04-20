import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Hospedagem from '../entities/Hospedagem';
import IHospedagensRepository from '../repositories/interfaces/IHospedagensRepository';

@injectable()
class ListHospedagemService {
  constructor(
    @inject('HospedagensRepository')
    private hospedagemRepository: IHospedagensRepository,
  ) {}

  public async execute(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ items: Hospedagem[]; total: number; totalPage: number }> {
    const {
      hospedagens: items,
      total,
    } = await this.hospedagemRepository.listHospedagem(page, perPage, query);

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

export default ListHospedagemService;
