import VListaMunicipios from '@modules/public/entities/VListaMunicipios';

export default interface IVListaMunicipiosRepository {
  findUf(sigla: string): Promise<VListaMunicipios[]>;
}
