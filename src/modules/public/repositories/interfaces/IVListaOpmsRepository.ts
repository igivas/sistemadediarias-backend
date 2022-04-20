import VListaOpms from '@modules/public/entities/VListaOpms';

export default interface IVListaOpmsRepository {
  findOpm(usuario: string): Promise<VListaOpms[]>;
}
