/* import DocumentoCurso from '@modules/sgi/entities/DocumentoCurso';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('curso', { schema: 'public' })
class Curso {
  @PrimaryColumn()
  cur_codigo: number;

  @Column()
  cur_nome: string;

  @Column()
  cur_sigla: string;

  @Column()
  cur_pontuacao_oficial: number;

  @Column()
  cur_pontuacao_praca: number;

  @Column()
  cur_tipo: string;

  @Column()
  cur_situacao: string;

  @Column()
  usuario_cadastro: number;

  @Column()
  data_cadastro: Date;

  @Column()
  usuario_alteracao: number;

  @Column()
  data_alteracao: Date;

  @OneToMany(() => DocumentoCurso, documentoCurso => documentoCurso.curso)
  documentos: DocumentoCurso[];
}

export default Curso;
 */
