import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Sistema from './Sistema';

@Entity('sistemas_usuarios', { schema: 'seg' })
class SistemaUsuario {
  @PrimaryGeneratedColumn()
  usu_codigo: string;

  @JoinColumn()
  @ManyToOne(() => Sistema)
  @JoinColumn({ name: 'sis_codigo' })
  sis_codigo: Sistema;
}

export default SistemaUsuario;
