import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('legislacao', { schema: 'dia2' })
class Legislacao {
  @PrimaryGeneratedColumn()
  id_leg: number;

  @Column()
  decreto_leg: string;

  @Column()
  situacao_leg: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  deletado_leg: number;
}

export default Legislacao;
