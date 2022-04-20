import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Classe from '../entities/Classes';
import IClassesRepository from '../repositories/interfaces/IClassesRepository';

interface IRequestClasse {
  id_cla: number;
  id_leg: number;
  descricao_cla: string;
  valor_intermun_cla: number;
  valor_interesta_cla: number;
  valor_internac_cla: number;
  situacao_cla: string;
  usuario_alteracao: string;
}

@injectable()
class EditClasseService {
  constructor(
    @inject('ClassesRepository')
    private classeRepository: IClassesRepository,
  ) {}

  public async execute(data: IRequestClasse): Promise<Classe> {
    const classe = await this.classeRepository.findById(data.id_cla);

    if (!classe) {
      throw new AppError('Não existe classe!', 404);
    }

    const classeUpdate = await this.classeRepository.update(classe, {
      ...data,
    });

    return classeUpdate;
  }
}
export default EditClasseService;
