import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewDashboardColog1624976685706
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create or replace view sisfard.v_dashboard_colog as 
        SELECT c.uni_prioridade AS identificador,
        c.uni_sigla AS opm_nm,
        m.uni_sigla AS opm_superior,
        c.uni_prioridade AS ordemopm,
        c.uni_codigo AS codigoopm,
            CASE
                WHEN l.uni_sigla::text = 'CMTE-GERAL'::text THEN 'UNIDADES ADMINISTRATIVAS'::character varying
                ELSE l.uni_sigla
            END AS opm_grd_cmdo,
        count(*)::integer AS total,
        count(
            CASE
                WHEN a.peu_editou = 1 THEN 1
                ELSE NULL::integer
            END) AS editou,
        count(
            CASE
                WHEN a.peu_editou = 0 THEN 1
                ELSE NULL::integer
            END) AS nao_editou
       FROM pessoa_uniforme a
         JOIN pessoa_pm d ON a.pes_codigo::text = d.pm_codigo::text AND (d.pts_codigo = ANY (ARRAY[1, 5]))
         JOIN unidade c ON d.uni_codigo::text = c.uni_codigo::text AND c.uni_lob = 2019
         JOIN unidade l ON l.uni_codigo = c.uni_grd_cmdo
         JOIN unidade m ON m.uni_codigo = c.uni_superior
      WHERE a.unf_codigo = 1
      GROUP BY l.uni_sigla, m.uni_sigla, c.uni_sigla, c.uni_prioridade, c.uni_codigo
      ORDER BY c.uni_prioridade;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_dashboard_colog`);
  }
}
