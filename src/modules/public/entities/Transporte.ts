import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transporte', { schema: 'dia2' })
class Transporte {
  @PrimaryGeneratedColumn()
  id_tran: number;

  @Column()
  descricao_tran: string;

  @Column()
  situacao_tran: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  deletado_tran: number;
}

export default Transporte;
