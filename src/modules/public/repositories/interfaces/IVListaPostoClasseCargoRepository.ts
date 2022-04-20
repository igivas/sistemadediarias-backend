import VListaPostoClasseCargo from '@modules/public/entities/VListaPostoClasseCargo';

export default interface IVListaPostoClasseCargoRepository {
  findCargo(tipific_cargo: string): Promise<VListaPostoClasseCargo[]>;
}
