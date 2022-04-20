import { getRepository, Repository } from 'typeorm';
import Funcao from '../entities/Funcao';
import IFuncoesRepository from './interfaces/IFuncoesRepository';

class FuncoesRepository implements IFuncoesRepository {
  private funcaoRepository: Repository<Funcao>;

  constructor() {
    this.funcaoRepository = getRepository(Funcao);
  }

  public async findFuncao(codigo: number): Promise<Funcao[]> {
    return this.funcaoRepository.find({
      where: {
        fun_codigo: codigo,
        fun_situacao: '01',
      },
    });
  }
}

export default FuncoesRepository;
