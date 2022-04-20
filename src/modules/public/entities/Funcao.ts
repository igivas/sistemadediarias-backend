import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('funcao', { schema: 'public' })
class Funcao {
  @PrimaryGeneratedColumn()
  fun_codigo: number;

  @Column()
  fun_nome: string;

  @Column()
  fun_sigla: string;

  @Column()
  fun_situacao: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @CreateDateColumn()
  data_alteracao: Date;

  @Column()
  usuario_cadastro: string;

  @Column()
  usuario_alteracao: string;
}

export default Funcao;
