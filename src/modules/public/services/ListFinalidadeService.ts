import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Finalidade from '../entities/Finalidade';
import IFinalidadesRepository from '../repositories/interfaces/IFinalidadesRepository';

@injectable()
class ListFinalidadeService {
  constructor(
    @inject('FinalidadesRepository')
    private finalidadeRepository: IFinalidadesRepository,
  ) {}

  public async execute(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ items: Finalidade[]; total: number; totalPage: number }> {
    const {
      finalidades: items,
      total,
    } = await this.finalidadeRepository.listFinalidade(page, perPage, query);

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

export default ListFinalidadeService;
