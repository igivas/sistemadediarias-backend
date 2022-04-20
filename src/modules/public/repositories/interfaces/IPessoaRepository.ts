import Pessoa from '@modules/public/entities/Pessoa';

export default interface IPessoasRepository {
  findByPesCodigo(cpf: string): Promise<Pessoa | undefined>;
}
