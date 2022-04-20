import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewListaItensOrdenados1622642579802
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create or replace view sisfard.v_lista_itens_ordenados as
    select 	id_item,
        id_categoria,
        nome,
        COALESCE(sexo, 'Unico'::character varying) AS sexo,
        COALESCE(tamanho, 'Unico'::character varying) AS tamanho,
        COALESCE(lateralidade_corporal, 'Unico'::character varying) AS lateralidade_corporal,
        alias,
        COALESCE(descricao, 'Não Informado'::character varying) AS descricao,
        criado_por,
        criado_em,
        atualizado_por,
        atualizado_em,
        tipo_batalhao
        from sisfard.itens
        order by id_categoria desc, nome,
        CASE
        WHEN sexo = 'Unico'  THEN 1
            WHEN sexo = 'M'  THEN 2
        WHEN sexo = 'F'  THEN 3
            END,
            CASE
            WHEN tamanho = 'P'  THEN 1
        WHEN tamanho = 'M'  THEN 2
        WHEN tamanho = 'G'  THEN 3
        WHEN tamanho = 'GG'  THEN 4
        WHEN tamanho = 'XG'  THEN 5
            END, tamanho asc`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_lista_itens_ordenados`);
  }
}
