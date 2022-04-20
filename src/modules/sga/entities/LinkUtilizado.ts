import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Validacao from './Validacao';

@Entity('links_utilizados')
class LinkUtilizado {
  @PrimaryGeneratedColumn()
  id_link_utilizado: number;

  @Column()
  id_validacao: number;

  @Column()
  cpf: string;

  @Column()
  token: string;

  @Column('timestamp with time zone')
  validade_token: Date;

  @Column()
  criado_por: string;

  @Column()
  criado_em: Date;

  @CreateDateColumn()
  utilizado_em: Date;

  @OneToOne(() => Validacao)
  @JoinColumn({ name: 'id_validacao' })
  validacao: Validacao;
}

export default LinkUtilizado;
