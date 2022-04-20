import Funcao from '@modules/public/entities/Funcao';

export default interface IFuncoesRepository {
  findFuncao(codigo: number): Promise<Funcao[]>;
}
