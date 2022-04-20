import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('municipio', { schema: 'public' })
class Municipio {
  @PrimaryColumn()
  mun_codigo: number;

  @Column()
  mun_nome: string;
}

export default Municipio;
