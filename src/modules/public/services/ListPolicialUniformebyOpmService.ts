import { injectable, inject } from 'tsyringe';

import IPessoasUniformesRepository from '../repositories/interfaces/IPessoasUniformesRepository';

import AppError from '../../../errors/AppError';

import PessoaUniforme from '../entities/PessoaUniforme';

@injectable()
class ListPolicialUniformebyOpmService {
  constructor(
    @inject('PessoasUniformesRepository')
    private pessoaUniformeRepository: IPessoasUniformesRepository,
  ) {}

  public async execute(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
    editou?: string,
    query?: string,
  ): Promise<{ items: PessoaUniforme[]; total: number; totalPage: number }> {
    const {
      uniformes: uniforme,
      total,
    } = await this.pessoaUniformeRepository.List(
      opm,
      page,
      perPage,
      subunidades,
      editou,
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

export default ListPolicialUniformebyOpmService;
