import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import Validacao from './Validacao';

@Entity('links')
class Link {
  @PrimaryGeneratedColumn()
  id_link: number;

  @Column()
  id_validacao: number;

  @Column()
  cpf: string;

  @Exclude()
  @Column()
  token: string;

  @Column('timestamp with time zone')
  validade_token: Date;

  @Column()
  criado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @OneToOne(() => Validacao)
  @JoinColumn({ name: 'id_validacao' })
  validacao: Validacao;
}

export default Link;
