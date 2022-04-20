import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import ClasseCargo from '../entities/ClasseCargo';
import IClassesCargoRepository from '../repositories/interfaces/IClassesCargoRepository';

@injectable()
class ListClasseCargoService {
  constructor(
    @inject('ClassesCargoRepository')
    private classeCargoRepository: IClassesCargoRepository,
  ) {}

  public async execute(
    page: number,
    perPage: number,
    id_cla?: number,
    id_leg?: number,
  ): Promise<{ items: ClasseCargo[]; total: number; totalPage: number }> {
    const {
      classesCargo: items,
      total,
    } = await this.classeCargoRepository.listClasseCargo(
      page,
      perPage,
      id_cla,
      id_leg,
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

export default ListClasseCargoService;
