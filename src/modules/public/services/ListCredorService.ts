import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import VListaCredor from '../entities/VListaCredor';
import IVListaCredorRepository from '../repositories/interfaces/IVListaCredorRepository';

@injectable()
class ListCredorService {
  constructor(
    @inject('VListaCredorRepository')
    private vListaCredorRepository: IVListaCredorRepository,
  ) {}

  public async execute(dados: string): Promise<{ items: VListaCredor[] }> {
    const items = await this.vListaCredorRepository.findCredor(dados);

    if (!items) {
      throw new AppError('Nenhum registro cadastrado!', 404);
    }

    return { items };
  }
}

export default ListCredorService;
