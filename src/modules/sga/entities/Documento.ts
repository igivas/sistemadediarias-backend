import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import AssinaturaDocumento from './AssinaturaDocumento';

@Entity('documentos')
class Documento {
  @PrimaryGeneratedColumn()
  id_documento: number;

  @Column()
  id_sistema: number;

  @Column()
  id_tipo_documento: number;

  @Column()
  tipo_documento: string;

  @Column()
  id_documento_origem: number;

  @Column()
  numero_documento: string;

  @Column()
  qtd_pg_documento_original: number;

  @Column()
  hash_sha1: string;

  @Column()
  hash_md5: string;

  @Column()
  verificador: string;

  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  ext: string;

  @Column()
  cpfs_interessados: string;

  @Column()
  opm_interessado: number;

  @Column()
  assinado: boolean;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @OneToMany(() => AssinaturaDocumento, assinatura => assinatura.documento)
  assinaturas?: AssinaturaDocumento[];
}

export default Documento;
