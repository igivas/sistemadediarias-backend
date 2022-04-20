import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('v_policial_validacao_assinatura')
class VPolicialValidacaoAssinatura {
  @PrimaryColumn()
  pm_codigo: string;

  @Column()
  gra_nome: string;

  @Column()
  pes_nome: string;

  @Column()
  pm_apelido: string;

  @Column()
  uni_codigo: number;

  @Column()
  uni_superior: number;

  @Column()
  uni_grd_cmdo: number;

  @Column()
  uni_sigla: string;

  @Column()
  id_validacao: number;

  @Column()
  validacao: string;

  @Column()
  assinatura: string;
}

export default VPolicialValidacaoAssinatura;
