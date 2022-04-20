import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Classe from '../entities/Classes';
import IClassesRepository from '../repositories/interfaces/IClassesRepository';

interface IRequestClasse {
  id_leg: number;
  descricao_cla: string;
  valor_intermun_cla: number;
  valor_interesta_cla: number;
  valor_internac_cla: number;
  situacao_cla: string;
  id_usuario: string;
}

@injectable()
class CreateClasseService {
  constructor(
    @inject('ClassesRepository')
    private classeRepository: IClassesRepository,
  ) {}

  public async execute(data: IRequestClasse): Promise<Classe> {
    const classeExists = await this.classeRepository.findByNome(
      data.descricao_cla,
    );
    if (classeExists) {
      throw new AppError('Este tipo de classe já existe!');
    }

    const classe = await this.classeRepository.create({
      ...data,
      usuario_cadastro: data.id_usuario,
    });

    return classe;
  }
}

export default CreateClasseService;
