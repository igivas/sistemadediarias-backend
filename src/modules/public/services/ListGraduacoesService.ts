import { injectable, inject } from 'tsyringe';
import IGraduacoesRepository from '../repositories/interfaces/IGraduacoesRepository';
import Graduacao from '../entities/Graduacao';

@injectable()
class ListGraduacoesService {
  constructor(
    @inject('GraduacoesRepository')
    private graduacoesRepository: IGraduacoesRepository,
  ) {}

  public async execute(): Promise<Graduacao[] | undefined> {
    const graduacoes = await this.graduacoesRepository.List();

    return graduacoes;
  }
}

export default ListGraduacoesService;
