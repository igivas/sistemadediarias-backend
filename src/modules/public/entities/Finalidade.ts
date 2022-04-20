import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('finalidade', { schema: 'dia2' })
class Finalidade {
  @PrimaryGeneratedColumn()
  id_fin: number;

  @Column()
  descricao_fin: string;

  @Column()
  situacao_fin: string;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  deletado_fin: number;
}

export default Finalidade;
