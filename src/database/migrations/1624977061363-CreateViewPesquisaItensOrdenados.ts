import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewPesquisaItensOrdenados1624977061363
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            create or replace view sisfard.v_lista_itens_ordenados as 
            SELECT itens.id_item,
            itens.id_categoria,
            itens.nome,
            COALESCE(itens.sexo, 'Unico'::character varying) AS sexo,
            COALESCE(itens.tamanho, 'Unico'::character varying) AS tamanho,
            COALESCE(itens.lateralidade_corporal, 'Unico'::character varying) AS lateralidade_corporal,
            COALESCE(itens.descricao, 'Não Informado'::character varying) AS descricao,
            COALESCE(itens.tipo_batalhao, 'Unico'::character varying) AS tipo_batalhao
           FROM sisfard.itens
          ORDER BY itens.id_categoria DESC, itens.nome, (
                CASE
                    WHEN itens.sexo::text = 'Unico'::text THEN 1
                    WHEN itens.sexo::text = 'M'::text THEN 2
                    WHEN itens.sexo::text = 'F'::text THEN 3
                    ELSE NULL::integer
                END), (
                CASE
                    WHEN itens.tamanho::text = 'P'::text THEN 1
                    WHEN itens.tamanho::text = 'M'::text THEN 2
                    WHEN itens.tamanho::text = 'G'::text THEN 3
                    WHEN itens.tamanho::text = 'GG'::text THEN 4
                    WHEN itens.tamanho::text = 'XG'::text THEN 5
                    ELSE NULL::integer
                END), (COALESCE(itens.tamanho, 'Unico'::character varying));`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_lista_itens_ordenados`);
  }
}
