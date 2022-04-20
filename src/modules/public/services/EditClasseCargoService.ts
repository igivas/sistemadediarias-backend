import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import ClasseCargo from '../entities/ClasseCargo';
import IClassesCargoRepository from '../repositories/interfaces/IClassesCargoRepository';

interface IRequestClasseCargo {
  id_cla_car: number;
  id_cla: number;
  codigo_cargo: number;
  id_leg: number;
  tipific_cargo: string;
  situacao_cla_car: string;
  usuario_alteracao: string;
}

@injectable()
class EditClasseCargoService {
  constructor(
    @inject('ClassesCargoRepository')
    private classeCargoRepository: IClassesCargoRepository,
  ) {}

  public async execute(data: IRequestClasseCargo): Promise<ClasseCargo> {
    const classeCargo = await this.classeCargoRepository.findById(
      data.id_cla_car,
    );

    if (!classeCargo) {
      throw new AppError('Não existe classe cargo!', 404);
    }

    const classeCargoUpdate = await this.classeCargoRepository.update(
      classeCargo,
      {
        ...data,
      },
    );

    return classeCargoUpdate;
  }
}

export default EditClasseCargoService;
