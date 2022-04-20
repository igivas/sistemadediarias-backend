import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Classe from './Classes';
import Legislacao from './Legislacao';

@Entity('classe_cargo', { schema: 'dia2' })
class ClasseCargo {
  @PrimaryGeneratedColumn()
  id_cla_car: number;

  @Column()
  id_cla: number;

  @Column()
  codigo_cargo: number;

  @Column()
  id_leg: number;

  @Column()
  tipific_cargo: string;

  @Column()
  situacao_cla_car: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  deletado_cla_car: number;

  @ManyToOne(() => Classe)
  @JoinColumn({ name: 'id_cla' })
  classe: Classe;

  @ManyToOne(() => Legislacao)
  @JoinColumn({ name: 'id_leg' })
  legislacao: Legislacao;
}

export default ClasseCargo;
