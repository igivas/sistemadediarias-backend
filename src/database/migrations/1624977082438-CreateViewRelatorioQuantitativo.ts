import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewRelatorioQuantitativo1624977082438
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create or replace view sisfard.v_relatorio_quantitativo as 
        SELECT consulta.id_virtual,
        consulta.prioridade,
        consulta.opm_nm,
        consulta.uni_superior,
        consulta.uni_grd_cmdo,
        consulta.uni_codigo,
        consulta.opm_superior,
        consulta.peca,
        consulta.tamanho,
        consulta.quantidade
       FROM ( SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'coturno'::text AS peca,
                a.peu_sapato::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1
              GROUP BY a.peu_sapato, c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'blusa'::text AS peca,
                a.peu_blusa_interna::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1
              GROUP BY a.peu_blusa_interna, c.uni_superior, c.uni_grd_cmdo, c.uni_prioridade, b.uni_codigo, m.uni_sigla, c.uni_sigla
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'gandola - Feminina'::text AS peca,
                a.peu_gandola::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1 AND a.peu_gandola_sexo = 'F'::bpchar
              GROUP BY a.peu_gandola, c.uni_superior, c.uni_grd_cmdo, c.uni_prioridade, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_gandola_sexo
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'gandola - Masculina'::text AS peca,
                a.peu_gandola::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1 AND a.peu_gandola_sexo = 'M'::bpchar
              GROUP BY a.peu_gandola, c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_gandola_sexo
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'calça - Masculina'::text AS peca,
                a.peu_calca::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1 AND a.peu_calca_sexo = 'M'::bpchar
              GROUP BY c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_calca
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'calça - Feminina'::text AS peca,
                a.peu_calca::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1 AND a.peu_calca_sexo = 'F'::bpchar
              GROUP BY c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_calca
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'cobertura'::text AS peca,
                a.peu_cabeca::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1
              GROUP BY c.uni_prioridade, b.uni_codigo, c.uni_superior, c.uni_grd_cmdo, m.uni_sigla, c.uni_sigla, a.peu_cabeca
            UNION
             SELECT random() AS id_virtual,
                c.uni_prioridade AS prioridade,
                c.uni_sigla AS opm_nm,
                c.uni_superior,
                c.uni_grd_cmdo,
                b.uni_codigo,
                m.uni_sigla AS opm_superior,
                'coldre'::text AS peca,
                a.peu_coldre::text AS tamanho,
                count(a.pes_codigo) AS quantidade
               FROM pessoa_uniforme a
                 LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                 LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
              WHERE a.peu_editou = 1
              GROUP BY c.uni_prioridade, b.uni_codigo, c.uni_superior, c.uni_grd_cmdo, m.uni_sigla, c.uni_sigla, a.peu_coldre
      ORDER BY 2, 6, 8, 9) consulta
      ORDER BY consulta.prioridade, consulta.uni_codigo, consulta.peca, (
            CASE
                WHEN consulta.tamanho = 'P'::text THEN 1
                WHEN consulta.tamanho = 'M'::text THEN 2
                WHEN consulta.tamanho = 'G'::text THEN 3
                WHEN consulta.tamanho = 'GG'::text THEN 4
                WHEN consulta.tamanho = 'XG'::text THEN 5
                ELSE NULL::integer
            END);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_relatorio_quantitativo`);
  }
}
