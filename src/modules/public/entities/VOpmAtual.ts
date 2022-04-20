import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_opms_atuais', { schema: 'public' })
class VOpmAtual {
  @PrimaryColumn()
  uni_codigo: number;

  @Column()
  uni_nome: string;

  @Column()
  uni_sigla: string;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;

  @Column()
  bisavo_codigo: number;

  @Column()
  operacional: string;

  @Column()
  especializada: string;
}

export default VOpmAtual;
