import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_lista_fardamento', { schema: 'sisfard' })
class VDashboardColog {
  @PrimaryColumn()
  peu_codigo: number;

  @Column()
  pm_numero: number;

  @Column()
  peu_cabeca: number;

  @Column()
  peu_calca: number;

  @Column()
  peu_sapato: number;

  @Column()
  peu_gandola: number;

  @Column()
  peu_blusa_interna: string;

  @Column()
  peu_coldre: string;

  @Column()
  peu_calca_sexo: string;

  @Column()
  peu_gandola_sexo: string;

  @Column()
  uni_codigo: string;

  @Column()
  uni_sigla: string;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;

  @Column()
  pm_codigo: string;

  @Column()
  pm_apelido: string;

  @Column()
  pm_sexo: string;

  @Column()
  gra_sigla: string;

  @Column()
  gra_nome: string;

  @Column()
  tipo_sanguineo: string;

  @Column()
  situacao_func: string;

  @Column()
  situacao_func_cat: string;

  @Column()
  editou: string;

  @Column()
  data_alteracao: string;
}

export default VDashboardColog;
