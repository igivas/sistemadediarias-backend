import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import VListaMunicipios from '../entities/VListaMunicipios';
import IVListaMunicipiosRepository from '../repositories/interfaces/IVListaMunicipiosRepository';

@injectable()
class ListMunicipiosService {
  constructor(
    @inject('VListaMunicipiosRepository')
    private vListaMunicipiosRepository: IVListaMunicipiosRepository,
  ) {}

  public async execute(sigla: string): Promise<{ items: VListaMunicipios[] }> {
    const items = await this.vListaMunicipiosRepository.findUf(sigla);

    if (!items) {
      throw new AppError('Nenhum registro encontrado!', 404);
    }

    return { items };
  }
}

export default ListMunicipiosService;
