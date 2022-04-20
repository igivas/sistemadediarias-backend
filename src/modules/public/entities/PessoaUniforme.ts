import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import PessoaFisicaPm from './PessoaFisicaPm';

@Entity('pessoa_uniforme', { schema: 'public' })
class PessoaUniforme {
  @PrimaryColumn()
  peu_codigo: number;

  @Column()
  pes_codigo: string;

  @Column()
  unf_codigo: number;

  @Column()
  peu_cabeca: number;

  @Column()
  peu_camisa: number;

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
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @Column()
  data_cadastro: Date;

  @Column()
  data_alteracao: Date;

  @Column()
  peu_editou: number;

  @Column()
  peu_calca_sexo: string;

  @Column()
  peu_gandola_sexo: number;

  @Column()
  peu_combatshirt: string;

  @Column()
  peu_combatshirt_sexo: string;

  @ManyToOne(
    () => PessoaFisicaPm,
    pessoaFisicaPm => pessoaFisicaPm.pessoa_uniforme,
  )
  @JoinColumn({ name: 'pes_codigo' })
  pessoaFisicaPm: PessoaFisicaPm;
}

export default PessoaUniforme;
