import { getRepository } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import IUpdateCredorDTO from '../dtos/IUpdateCredorDTO';
import PessoaPm from '../entities/PessoaPm';
import ICredoresRepository from './interfaces/ICredoresRepository';

class CredoresRepository implements ICredoresRepository {
  private credoresRepository: Repository<PessoaPm>;

  constructor() {
    this.credoresRepository = getRepository(PessoaPm);
  }

  public async findByPm(matricula: string): Promise<PessoaPm | undefined> {
    const credor = await this.credoresRepository.findOne({
      where: {
        pm_codigo: matricula,
      },
    });

    return credor;
  }

  public async update(
    credor: PessoaPm,
    newData: IUpdateCredorDTO,
  ): Promise<PessoaPm> {
    const credorUpdate = await this.credoresRepository.merge(credor, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.credoresRepository.save(credorUpdate);

    return credorUpdate;
  }
}

export default CredoresRepository;
