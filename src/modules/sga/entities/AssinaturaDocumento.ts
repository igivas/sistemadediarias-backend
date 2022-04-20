import Pessoa from '@modules/public/entities/Pessoa';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import Documento from './Documento';

export enum TiposAssinaturas {
  'proprio' = '0',
  'por_ordem' = '1',
  'no_impedimento' = '2',
}

@Entity('assinaturas_documentos')
class AssinaturaDocumento {
  @PrimaryGeneratedColumn()
  id_assinatura_documento: number;

  @Column()
  id_documento: number;

  @Column()
  cpf: string;

  @Column()
  pes_codigo: string;

  @Column({
    type: 'enum',
    enum: TiposAssinaturas,
    default: TiposAssinaturas['proprio'],
  })
  tipo_assinatura: '0' | '1' | '2';

  @Column()
  hash_sha1: string;

  @Column()
  hash_md5: string;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @ManyToOne(() => Documento)
  @JoinColumn({ name: 'id_documento' })
  documento: Documento;

  @OneToOne(() => Pessoa)
  @JoinColumn({ name: 'pes_codigo' })
  pessoa: Pessoa;
}

export default AssinaturaDocumento;
