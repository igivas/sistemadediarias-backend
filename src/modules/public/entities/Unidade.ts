import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Municipio from './Municipio';

@Entity('unidade', { schema: 'public' })
class Unidade {
  @PrimaryColumn()
  uni_codigo: number;

  @Column()
  uni_nome: string;

  @Column()
  mun_codigo: number;

  @Column()
  uni_sigla: string;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;

  @Column()
  uni_lob: number;

  @ManyToOne(() => Municipio)
  @JoinColumn({ name: 'mun_codigo' })
  municipio: Municipio;
}

export default Unidade;
