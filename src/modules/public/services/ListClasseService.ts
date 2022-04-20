import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Classe from '../entities/Classes';
import IClassesRepository from '../repositories/interfaces/IClassesRepository';

@injectable()
class ListClasseService {
  constructor(
    @inject('ClassesRepository')
    private classeRepository: IClassesRepository,
  ) {}

  public async execute(
    page: number,
    perPage: number,
    id_leg: number,
    query?: string,
  ): Promise<{ items: Classe[]; total: number; totalPage: number }> {
    const { classes: items, total } = await this.classeRepository.listClasse(
      page,
      perPage,
      id_leg,
      query,
    );

    if (!items) {
      throw new AppError('Nenhum registro cadastrado!', 404);
    }
    return {
      totalPage: Math.ceil(total / Number(perPage)),
      total,
      items,
    };
  }
}

export default ListClasseService;
