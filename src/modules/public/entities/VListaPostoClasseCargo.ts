import { Column, PrimaryColumn, ViewEntity } from 'typeorm';

@ViewEntity('v_lista_posto_classe_cargo', { schema: 'dia2' })
class VListaPostoClasseCargo {
  @PrimaryColumn()
  tipo: string;

  @Column()
  prioridade: number;

  @Column()
  codigo: number;

  @Column()
  cargo: string;
}

export default VListaPostoClasseCargo;
