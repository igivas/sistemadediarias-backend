import { getRepository, Repository } from 'typeorm';
import IGraduacoesRepository from './interfaces/IGraduacoesRepository';
import Graduacao from '../entities/Graduacao';

class GraduacoesRepository implements IGraduacoesRepository {
  private ormRepository: Repository<Graduacao>;

  constructor() {
    this.ormRepository = getRepository(Graduacao);
  }

  public async findById(id: number): Promise<Graduacao | undefined> {
    const graduacao = await this.ormRepository.findOne(id);

    return graduacao;
  }

  public async List(): Promise<Graduacao[] | undefined> {
    const graduacao = await this.ormRepository.find();

    return graduacao;
  }
}

export default GraduacoesRepository;
