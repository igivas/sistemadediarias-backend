import { injectable, inject } from 'tsyringe';
import IPessoasUniformesRepository from '../repositories/interfaces/IPessoasUniformesRepository';
import PessoaUniforme from '../entities/PessoaUniforme';

@injectable()
class ListDashboardCologService {
  constructor(
    @inject('PessoasUniformesRepository')
    private pessoaUniformeRepository: IPessoasUniformesRepository,
  ) {}

  public async execute(): Promise<PessoaUniforme[] | undefined> {
    const policiais = await this.pessoaUniformeRepository.ListDashboardDataColog();

    return policiais;
  }
}

export default ListDashboardCologService;
