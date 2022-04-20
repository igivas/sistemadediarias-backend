import { Column, PrimaryColumn, ViewEntity } from 'typeorm';

@ViewEntity('v_lista_usuarios_unidade', { schema: 'dia2' })
class VListaOpms {
  @PrimaryColumn()
  usuario: string;

  @Column()
  sistema: string;

  @Column()
  cod_unidade: number;

  @Column()
  nome_unidade: string;
}

export default VListaOpms;
