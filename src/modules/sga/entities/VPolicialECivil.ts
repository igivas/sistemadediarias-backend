import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_policial_e_civil', { schema: 'sga' })
class VPolicialAndCivil {
  @PrimaryColumn()
  matricula: string;

  @Column()
  tipo: number;

  @Column()
  opm_codigo: string;

  @Column()
  opm_nome: string;

  @Column()
  dados: number;

  @Column()
  uni_codigo: number;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;
}

export default VPolicialAndCivil;
