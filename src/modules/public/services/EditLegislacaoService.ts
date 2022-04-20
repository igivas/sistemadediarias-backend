import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Legislacao from '../entities/Legislacao';
import ILegislacoesRepository from '../repositories/interfaces/ILegislacoesRepository';

interface IRequestLegislacao {
  id_leg: number;
  decreto_leg: string;
  situacao_leg: string;
  usuario_alteracao: string;
}

@injectable()
class EditLegislacaoService {
  constructor(
    @inject('LegislacoesRepository')
    private legislacaoRepository: ILegislacoesRepository,
  ) {}

  public async execute(data: IRequestLegislacao): Promise<Legislacao> {
    const legislacao = await this.legislacaoRepository.findById(data.id_leg);

    if (!legislacao) {
      throw new AppError('Legislação não existe!', 404);
    }

    const legislacaoUpdate = await this.legislacaoRepository.update(
      legislacao,
      {
        ...data,
      },
    );

    return legislacaoUpdate;
  }
}

export default EditLegislacaoService;
