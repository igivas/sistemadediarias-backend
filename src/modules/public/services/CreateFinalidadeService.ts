import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Finalidade from '../entities/Finalidade';
import IFinalidadesRepository from '../repositories/interfaces/IFinalidadesRepository';

interface IRequestFinalidade {
  descricao_fin: string;
  situacao_fin: string;
  id_usuario: string;
}

@injectable()
class CreateFinalidadeService {
  constructor(
    @inject('FinalidadesRepository')
    private finalidadeRepository: IFinalidadesRepository,
  ) {}

  public async execute(data: IRequestFinalidade): Promise<Finalidade> {
    const finalidadeExists = await this.finalidadeRepository.findByNome(
      data.descricao_fin,
    );
    if (finalidadeExists) {
      throw new AppError('Este tipo de finalidade já existe!');
    }

    const finalidade = await this.finalidadeRepository.create({
      ...data,
      usuario_cadastro: data.id_usuario,
    });

    return finalidade;
  }
}

export default CreateFinalidadeService;
