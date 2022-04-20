import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';

@injectable()
class RevogaValidacaoService {
  constructor(
    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(id_validacao: number, atualizado_por: string): Promise<any> {
    const validacao = await this.validacoesRepository.findById(id_validacao);

    if (!validacao) {
      throw new AppError('Esta validacão não existe ou já foi concluída');
    }

    const validacaoUpdated = await this.validacoesRepository.update(validacao, {
      status: 3,
      atualizado_por,
    });

    return validacaoUpdated;
  }
}

export default RevogaValidacaoService;
