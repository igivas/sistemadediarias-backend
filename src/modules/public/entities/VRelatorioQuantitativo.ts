import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_relatorio_quantitativo', { schema: 'sisfard' })
class VRelatorioQuantitativo {
  @PrimaryColumn()
  id_virtual: number;

  @Column()
  prioridade: number;

  @Column()
  opm_nm: string;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;

  @Column()
  uni_codigo: number;

  @Column()
  opm_superior: string;

  @Column()
  peca: string;

  @Column()
  tamanho: string;

  @Column()
  quantidade: string;
}

export default VRelatorioQuantitativo;
