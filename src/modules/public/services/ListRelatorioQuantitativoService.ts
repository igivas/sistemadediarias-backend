import { injectable, inject } from 'tsyringe';

import IPessoasUniformesRepository from '../repositories/interfaces/IPessoasUniformesRepository';

import AppError from '../../../errors/AppError';

import VRelatorioQuantitativo from '../entities/VRelatorioQuantitativo';

@injectable()
class ListRelatorioQuantitativoService {
  constructor(
    @inject('PessoasUniformesRepository')
    private pessoaUniformeRepository: IPessoasUniformesRepository,
  ) {}

  public async execute(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
    query?: string,
  ): Promise<{
    items: VRelatorioQuantitativo[];
    total: number;
    totalPage: number;
  }> {
    const {
      dados: uniforme,
      total,
    } = await this.pessoaUniformeRepository.ListRelatorioQuantitativo(
      opm,
      page,
      perPage,
      subunidades,
      query,
    );

    if (!uniforme) {
      throw new AppError('O endereço não existe', 404);
    }

    return {
      totalPage: Math.ceil(total / Number(perPage)),
      total,
      items: uniforme,
    };
  }
}

export default ListRelatorioQuantitativoService;
