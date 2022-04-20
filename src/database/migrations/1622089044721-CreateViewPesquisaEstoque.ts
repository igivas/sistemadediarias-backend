import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewPesquisaEstoque1622089044721
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create or replace view sisfard.v_pesquisa_estoque as 
    select a.id_item, b.pesquisa,sum(a.quantidade) as quantidade
     from sisfard.itens_entrada_colog a inner join sisfard.v_pesquisa_itens
      b on a.id_item=b.id_item group by a.id_item,b.pesquisa
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_pesquisa_estoque`);
  }
}
