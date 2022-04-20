import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Legislacao from './Legislacao';

@Entity('classe', { schema: 'dia2' })
class Classe {
  @PrimaryGeneratedColumn()
  id_cla: number;

  @Column()
  id_leg: number;

  @Column()
  descricao_cla: string;

  @Column()
  valor_intermun_cla: number;

  @Column()
  valor_interesta_cla: number;

  @Column()
  valor_internac_cla: number;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  situacao_cla: string;

  @Column()
  deletado_cla: number;

  @OneToOne(() => Legislacao)
  @JoinColumn({ name: 'id_leg' })
  legislacao: Legislacao;
}

export default Classe;
