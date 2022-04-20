import { Column, PrimaryColumn, ViewEntity } from 'typeorm';

@ViewEntity('v_lista_pm_graduacao_sigla', { schema: 'public' })
class VListaCredor {
  @PrimaryColumn()
  matricula: string;

  @Column()
  numero: string;

  @Column()
  graduacao: string;

  @Column()
  nome: string;

  @Column()
  nome_guerra: string;

  @Column()
  funcao: number;

  @Column()
  unidade_lotacao: number;

  @Column()
  tipo_situacao: number;

  @Column()
  situacao_funcional: number;

  @Column()
  unidade: number;

  @Column()
  unidade_pessoa: string;

  @Column()
  pm_num_credor: number;

  @Column()
  unidade_superior: number;

  @Column()
  dados: string;

  @Column()
  dados1: string;
}

export default VListaCredor;
