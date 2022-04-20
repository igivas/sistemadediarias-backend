import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Legislacao from '../entities/Legislacao';

import ILegislacoesRepository from '../repositories/interfaces/ILegislacoesRepository';

@injectable()
class ListLegislacaoService {
  constructor(
    @inject('LegislacoesRepository')
    private legislacaoRepository: ILegislacoesRepository,
  ) {}

  public async execute(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ items: Legislacao[]; total: number; totalPage: number }> {
    const {
      legislacoes: items,
      total,
    } = await this.legislacaoRepository.listLegislacao(page, perPage, query);

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

export default ListLegislacaoService;
