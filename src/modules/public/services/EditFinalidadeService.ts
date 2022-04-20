import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Finalidade from '../entities/Finalidade';
import IFinalidadesRepository from '../repositories/interfaces/IFinalidadesRepository';

interface IRequestFinalidade {
  id_fin: number;
  descricao_fin: string;
  situacao_fin: string;
  usuario_alteracao: string;
}

@injectable()
class EditFinalidadeService {
  constructor(
    @inject('FinalidadesRepository')
    private finalidadeRepository: IFinalidadesRepository,
  ) {}

  public async execute(data: IRequestFinalidade): Promise<Finalidade> {
    const finalidade = await this.finalidadeRepository.findById(data.id_fin);

    if (!finalidade) {
      throw new AppError('Finalidade não existe!', 404);
    }

    const finalidadeUpdate = await this.finalidadeRepository.update(
      finalidade,
      { ...data },
    );

    return finalidadeUpdate;
  }
}
export default EditFinalidadeService;
