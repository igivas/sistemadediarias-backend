import { getRepository, Repository } from 'typeorm';
import VListaOpms from '../entities/VListaOpms';
import IVListaOpmsRepository from './interfaces/IVListaOpmsRepository';

class VListaOpmsRepository implements IVListaOpmsRepository {
  private opmRepository: Repository<VListaOpms>;

  constructor() {
    this.opmRepository = getRepository(VListaOpms);
  }

  public async findOpm(matricula: string): Promise<VListaOpms[]> {
    return this.opmRepository.find({
      where: {
        usuario: matricula,
        sistema: 32,
      },
    });
  }
}

export default VListaOpmsRepository;
