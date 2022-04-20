import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hospedagem', { schema: 'dia2' })
class Hospedagem {
  @PrimaryGeneratedColumn()
  id_hosp: number;

  @Column()
  descricao_hosp: string;

  @Column()
  situacao_hosp: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  deletado_hosp: number;
}

export default Hospedagem;
