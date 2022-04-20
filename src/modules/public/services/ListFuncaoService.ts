import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import Funcao from '../entities/Funcao';
import IFuncoesRepository from '../repositories/interfaces/IFuncoesRepository';

@injectable()
class ListFuncaoService {
  constructor(
    @inject('FuncoesRepository')
    private funcoesRepository: IFuncoesRepository,
  ) {}

  public async execute(codigo: number): Promise<{ items: Funcao[] }> {
    const items = await this.funcoesRepository.findFuncao(codigo);

    if (!items) {
      throw new AppError('Nenhum registro encontrado!', 404);
    }

    return { items };
  }
}

export default ListFuncaoService;
