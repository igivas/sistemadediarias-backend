import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewPesquisaEstoqueHistorico1622125512974
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    create or replace view sisfard.v_pesquisa_estoque_historico as select a.id_item_entrada,a.id_item,c.pesquisa,a.lote,a.quantidade,b.nota_fiscal,d.nome as fornecedor,b.data_pedido,b.data_entrada
    from sisfard.itens_entrada_colog a inner join
   sisfard.entrada_colog b 
   on a.id_entrada_colog=b.id_entrada_colog 
   
   inner join sisfard.v_pesquisa_itens c
   on a.id_item = c.id_item
   
   inner join sisfard.fornecedores d
   on b.id_fornecedor=d.id_fornecedor
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_pesquisa_estoque`);
  }
}
