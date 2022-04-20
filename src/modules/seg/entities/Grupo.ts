import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('grupos', { schema: 'seg' })
class Grupo {
  @PrimaryGeneratedColumn()
  gru_codigo: number;

  @Column()
  sis_codigo: number;

  @Column()
  gru_nome: string;
}

export default Grupo;
