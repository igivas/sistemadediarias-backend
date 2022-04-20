import { Column, PrimaryColumn, ViewEntity } from 'typeorm';

@ViewEntity('v_lista_municipios', { schema: 'dia2' })
class VListaMunicipios {
  @PrimaryColumn()
  codigo_muni: string;

  @Column()
  cod_estado: string;

  @Column()
  sigla_estado: string;

  @Column()
  descricao_muni_estado: string;
}

export default VListaMunicipios;
