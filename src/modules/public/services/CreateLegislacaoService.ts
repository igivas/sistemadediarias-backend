import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Legislacao from '../entities/Legislacao';
import ILegislacoesRepository from '../repositories/interfaces/ILegislacoesRepository';

interface IRequestLegislacao {
  decreto_leg: string;
  situacao_leg: string;
  usuario_cadastro: string;
}

@injectable()
class CreateLegislacaoService {
  constructor(
    /* @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository, */

    @inject('LegislacoesRepository')
    private legislacaoRepository: ILegislacoesRepository,
  ) {}

  public async execute(data: IRequestLegislacao): Promise<Legislacao> {
    const legislacaoExists = await this.legislacaoRepository.findByNome(
      data.decreto_leg,
    );
    if (legislacaoExists) {
      throw new AppError('Legislação já cadastrada');
    }

    const legislacao = await this.legislacaoRepository.create(data);
    return legislacao;
  }
}

export default CreateLegislacaoService;
