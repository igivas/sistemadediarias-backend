import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('pessoa_pm', { schema: 'public' })
class PessoaPm {
  @PrimaryColumn()
  pm_codigo: string;

  @Column()
  pm_num_credor: number;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_alteracao: Date;
}

export default PessoaPm;
