import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Pessoa from '@modules/public/entities/Pessoa';

export enum StatusValidacao {
  'Pendente' = '1',
  'Validado' = '2',
  'Revogado' = '3',
}

@Entity('validacoes')
class Validacao {
  @PrimaryGeneratedColumn()
  id_validacao: number;

  @Column()
  pes_codigo: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column()
  militar: boolean;

  @Column()
  @Exclude()
  codigo_validacao: string;

  @Column({
    type: 'enum',
    enum: StatusValidacao,
    default: StatusValidacao['Pendente'],
  })
  status: string;

  @Column()
  criado_por: string;

  @Column()
  atualizado_por: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'pes_codigo' })
  pessoa: Pessoa;
}

export default Validacao;
