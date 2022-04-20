import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import ClasseCargo from '../entities/ClasseCargo';
import IClassesCargoRepository from '../repositories/interfaces/IClassesCargoRepository';

interface IRequestClasseCargo {
  id_cla: number;
  codigo_cargo: number;
  id_leg: number;
  tipific_cargo: string;
  situacao_cla_car: string;
  id_usuario: string;
}

@injectable()
class CreateClasseCargoService {
  constructor(
    @inject('ClassesCargoRepository')
    private classeCargoRepository: IClassesCargoRepository,
  ) {}

  public async execute(data: IRequestClasseCargo): Promise<ClasseCargo> {
    const classeCargoExists = await this.classeCargoRepository.findTipoClasseCargo(
      data.id_cla,
      data.codigo_cargo,
      data.id_leg,
      data.tipific_cargo,
    );
    if (classeCargoExists) {
      throw new AppError('Já existe um cargo relacionado a essa classe!');
    }

    const classeCargo = await this.classeCargoRepository.create({
      ...data,
      usuario_cadastro: data.id_usuario,
    });

    return classeCargo;
  }
}

export default CreateClasseCargoService;
