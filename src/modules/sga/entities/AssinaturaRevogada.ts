import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Pessoa from '@modules/public/entities/Pessoa';
import Validacao from './Validacao';
import LinkUtilizado from './LinkUtilizado';

@Entity('assinaturas_revogadas')
class AssinaturaRevogada {
  @PrimaryGeneratedColumn()
  id_assinatura_revogada: number;

  @Column()
  cpf: string;

  @Column()
  pes_codigo: string;

  @Column()
  @Exclude()
  hash_assinatura: string;

  @Column('timestamp with time zone')
  validade_assinatura: Date;

  @Column()
  @Exclude()
  hash_pin: string;

  @Column()
  validade_pin: Date;

  @Column()
  id_link_utilizado: number;

  @Column()
  id_validacao: number;

  @CreateDateColumn()
  revogado_em: Date;

  @OneToOne(() => Validacao)
  @JoinColumn({ name: 'id_validacao' })
  validacao: Validacao;

  @OneToOne(() => LinkUtilizado)
  @JoinColumn({ name: 'id_link_utilizado' })
  link_utilizado: LinkUtilizado;

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'pes_codigo' })
  pessoa: Pessoa;
}

export default AssinaturaRevogada;
