import { injectable, inject } from 'tsyringe';

import IPessoasUniformesRepository from '../repositories/interfaces/IPessoasUniformesRepository';

import AppError from '../../../errors/AppError';

import PessoaUniforme from '../entities/PessoaUniforme';

@injectable()
class ListPolicialUniformebyOpmServicePendentes {
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
  ): Promise<{ items: PessoaUniforme[]; total: number; totalPage: number }> {
    const {
      uniformes: uniforme,
      total,
    } = await this.pessoaUniformeRepository.ListPendentes(
      opm,
      page,
      perPage,
      subunidades,
      query,
    );

    if (!uniforme) {
      throw new AppError('O uniforme não existe', 404);
    }

    return {
      totalPage: Math.ceil(total / Number(perPage)),
      total,
      items: uniforme,
    };
  }
}

export default ListPolicialUniformebyOpmServicePendentes;
