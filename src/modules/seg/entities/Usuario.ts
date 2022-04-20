import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';

import GrupoUsuario from './GrupoUsuario';
import SistemaUsuario from './SistemaUsuario';

@Entity('usuarios', { schema: 'seg' })
class Usuario {
  @PrimaryColumn()
  usu_codigo: string;

  @Column()
  usu_nome: string;

  @Column()
  usu_senha: string;

  @Column()
  usu_email: string;

  @OneToMany(() => GrupoUsuario, grupoUsuario => grupoUsuario.usu_codigo)
  grupos_usuarios: GrupoUsuario[];

  @OneToMany(() => SistemaUsuario, sistemaUsuario => sistemaUsuario.usu_codigo)
  sistemas_usuarios: SistemaUsuario[];
}

export default Usuario;
