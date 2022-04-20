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
class DeleteLegislacaoService {
  constructor(
    @inject('LegislacoesRepository')
    private legislacaoRepository: ILegislacoesRepository,
  ) {}

  public async execute(data: IRequestLegislacao): Promise<Legislacao> {
    const legislacao = await this.legislacaoRepository.findById(data.id_leg);

    if (!legislacao) {
      throw new AppError('Legislação não existe!', 404);
    }

    const legislacaoUpdated = await this.legislacaoRepository.softDelete(
      legislacao,
      { ...data },
    );
    return legislacaoUpdated;
  }
}

export default DeleteLegislacaoService;
