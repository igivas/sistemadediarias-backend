import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Legislacao from '../entities/Legislacao';
import ILegislacoesRepository from '../repositories/interfaces/ILegislacoesRepository';

interface IRequestLegislacao {
  id_leg: number;
}

@injectable()
class ShowLegislacaoService {
  constructor(
    @inject('LegislacaoRepository')
    private legislacaoRepository: ILegislacoesRepository,
  ) {}

  async execute(data: IRequestLegislacao): Promise<Legislacao> {
    const legislacao = await this.legislacaoRepository.findById(data.id_leg);

    if (!legislacao) {
      throw new AppError('Legislação inexistente!');
    }

    return legislacao;
  }
}

export default ShowLegislacaoService;
