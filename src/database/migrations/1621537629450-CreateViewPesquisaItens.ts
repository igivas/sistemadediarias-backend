import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewPesquisaItens1621537629450
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create or replace view sisfard.v_pesquisa_itens as
select id_item, 
CASE
	--caso de blusa
	when (id_categoria = 1 and sexo isnull and tipo_batalhao isnull) then 'Fardamento - ' || nome || ' - ' || tamanho	
	--caso da calça ou gandola masculina
	when (id_categoria = 1 AND sexo='M') then 'Fardamento - ' || nome ||  ' Masculina - ' || tamanho || ' - ' || tipo_batalhao
	--caso da calça ou gandola feminina
	when (id_categoria = 1 AND sexo='F') then 'Fardamento - ' || nome ||  ' Feminina - ' || tamanho || ' - ' || tipo_batalhao
	--caso de cobertura e coturno
	when (id_categoria = 1 AND sexo isnull) then 'Fardamento - ' || nome ||  ' - ' || tamanho || ' - ' || tipo_batalhao
	when (id_categoria = 2 and lateralidade_corporal='D') then 'Acessório - ' || nome || ' - ' ||  'Destro' 
	when (id_categoria = 2 and lateralidade_corporal='C') then 'Acessório - ' || nome || ' - ' ||  'Canhoto' 
END as pesquisa
from sisfard.itens order by id_item
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_pesquisa_itens`);
  }
}
