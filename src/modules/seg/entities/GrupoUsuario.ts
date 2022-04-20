import { Entity, PrimaryColumn } from 'typeorm';

@Entity('grupos_usuarios', { schema: 'seg' })
class GrupoUsuario {
  @PrimaryColumn()
  usu_codigo: string;

  @PrimaryColumn()
  gru_codigo: number;
}

export default GrupoUsuario;
