import { injectable, inject } from 'tsyringe';
import IPessoasUniformesRepository from '../repositories/interfaces/IPessoasUniformesRepository';
import PessoaUniforme from '../entities/PessoaUniforme';

@injectable()
class ListDashboardDataOpmService {
  constructor(
    @inject('PessoasUniformesRepository')
    private pessoaUniformeRepository: IPessoasUniformesRepository,
  ) {}

  public async execute(
    opm: string,
    subunidades: string,
  ): Promise<PessoaUniforme[] | undefined> {
    const policiais = await this.pessoaUniformeRepository.ListDashboardDataOpm(
      opm,
      subunidades,
    );

    return policiais;
  }
}

export default ListDashboardDataOpmService;
