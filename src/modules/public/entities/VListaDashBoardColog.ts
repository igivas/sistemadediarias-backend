import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_dashboard_colog', { schema: 'sisfard' })
class VDashboardColog {
  @PrimaryColumn()
  identificador: number;

  @Column()
  opm_nm: string;

  @Column()
  opm_superior: string;

  @Column()
  ordemopm: string;

  @Column()
  uni_grd_cmdo: string;

  @Column()
  uni_superior: number;

  @Column()
  codigoopm: string;

  @Column()
  opm_grd_cmdo: string;

  @Column()
  total: number;

  @Column()
  editou: number;

  @Column()
  nao_editou: number;
}

export default VDashboardColog;
