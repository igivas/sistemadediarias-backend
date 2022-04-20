import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import PessoaPm from '../entities/PessoaPm';
import ICredoresRepository from '../repositories/interfaces/ICredoresRepository';

interface IRequestCredor {
  pm_codigo: string;
  pm_num_credor: number;
  usuario_alteracao: string;
}

@injectable()
class EditCredorService {
  constructor(
    @inject('CredoresRepository')
    private credorRepository: ICredoresRepository,
  ) {}

  public async execute(data: IRequestCredor): Promise<PessoaPm> {
    const credor = await this.credorRepository.findByPm(data.pm_codigo);

    if (!credor) {
      throw new AppError('Não existe PM copm esta matrícula!', 404);
    }

    const credorUpdate = await this.credorRepository.update(credor, {
      ...data,
    });

    return credorUpdate;
  }
}

export default EditCredorService;
