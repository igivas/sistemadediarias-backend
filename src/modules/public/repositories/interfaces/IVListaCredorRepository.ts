import VListaCredor from '@modules/public/entities/VListaCredor';

export default interface IVListaCredorRepository {
  findCredor(dados: string): Promise<VListaCredor[]>;
}
