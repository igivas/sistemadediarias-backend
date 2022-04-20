import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateViewDashboardCologDados1624976985715
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create or replace view sisfard.v_dashboard_colog_dados as 
        SELECT
        CASE
            WHEN d.spm_tipo::text = '4'::text THEN 1
            WHEN d.spm_tipo::text = ANY (ARRAY['2'::text, '3'::text, '5'::text]) THEN 2
            WHEN d.spm_tipo::text = '1'::text THEN 3
            ELSE 4
        END AS ord,
        CASE
            WHEN d.spm_tipo::text = '4'::text THEN 'DISPONÍVEL'::text
            WHEN d.spm_tipo::text = ANY (ARRAY['2'::text, '3'::text, '5'::text]) THEN 'INDISPONÍVEL TEMPORÁRIO'::text
            WHEN d.spm_tipo::text = '1'::text THEN 'INDISPONÍVEL DEFINITIVO'::text
            ELSE 'NÃO INFORMADO'::text
        END AS categoria,
    b.uni_prioridade AS opm_ord,
    b.uni_codigo AS opm_id,
    b.uni_sigla AS opm_nm,
    b.uni_superior AS opm_superior_id,
    m.uni_sigla AS opm_superior,
    b.uni_grd_cmdo AS opm_grd_cmdo_id,
        CASE
            WHEN l.uni_sigla::text = 'CMTE-GERAL'::text THEN 'UNIDADES ADMINISTRATIVAS'::character varying
            ELSE l.uni_sigla
        END AS opm_grd_cmdo,
    upper(h.mun_nome::text) AS opm_munic,
    g.cor_nome AS opm_tp,
    COALESCE(f.cor_nome, ''::character varying) AS opm_regiao,
        CASE
            WHEN b.uni_especializada::text = '0'::text THEN 'NÃO'::text
            WHEN b.uni_especializada::text = '1'::text THEN 'SIM'::text
            ELSE 'NÃO INFORMADO'::text
        END AS opm_especializada,
        CASE
            WHEN b.uni_operacional::text = 'N'::text THEN 'ADM'::text
            WHEN b.uni_operacional::text = 'S'::text THEN 'OPERACIONAL'::text
            ELSE 'NÃO INFORMADO'::text
        END AS opm_oper_adm,
    x.pes_codigo AS matricula,
    a.pm_numero AS numero,
    a.gra_codigo AS pm_pos_grad_cod,
    c.gra_sigla AS pm_pos_grad,
        CASE
            WHEN c.gra_oficial::text = 'N'::text THEN 'PRAÇA'::text
            WHEN c.gra_oficial::text = 'S'::text THEN 'OFICIAL'::text
            ELSE 'NÃO INFORMADO'::text
        END AS pm_ofic_prac,
    x.pes_nome AS nome,
    j.qua_sigla AS pm_quadro,
    a.pm_sexo,
    i.cor_nome AS pm_escolaridade,
        CASE
            WHEN a.pm_atividade::text = '01'::text THEN 'ADMINISTRATIVO'::text
            WHEN a.pm_atividade::text = '02'::text THEN 'OPERACIONAL'::text
            ELSE 'NÃO INFORMADO'::text
        END AS pm_atividade,
        CASE
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - SUSTAÇÃO'::text THEN 'EM ATIVIDADE'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - ADIAMENTO'::text THEN 'EM ATIVIDADE'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59 §3) - FRACIONAMENTO'::text THEN 'EM ATIVIDADE'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - CONCESSÃO'::text THEN 'EM ATIVIDADE'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - ANTECIPAÇÃO'::text THEN 'FÉRIAS'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - CONCESSÃO E GOZO'::text THEN 'FÉRIAS'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - GOZO'::text THEN 'FÉRIAS'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59 §3) - GOZO APÓS FRACIONAMENTO'::text THEN 'FÉRIAS'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - GOZO APÓS ADIAMENTO'::text THEN 'FÉRIAS'::character varying
            WHEN d.spm_nome::text = 'FÉRIAS (ART. 59) - GOZO APÓS SUSTAÇÃO'::text THEN 'FÉRIAS'::character varying
            ELSE d.spm_nome
        END AS situacao_func,
    COALESCE(n.uni_codigo, '-1'::integer) AS opm_lotacao_cod,
    COALESCE(p.uni_lob, '-1'::integer) AS opm_lotacao_lob,
    COALESCE(p.uni_sigla, 'NÃO INFORMADO'::character varying) AS opm_lotacao,
    COALESCE(o.fun_nome, 'NÃO INFORMADO'::character varying) AS funcao,
    a1.peu_cabeca AS cabeca,
    a1.peu_calca_sexo AS calca_sexo,
    a1.peu_calca AS calca,
    a1.peu_sapato AS coturno,
    a1.peu_gandola_sexo AS gandola_sexo,
    a1.peu_gandola AS gandola,
    a1.peu_blusa_interna AS blusa_interna,
    a1.peu_coldre AS coldre,
    a1.data_alteracao,
        CASE
            WHEN a1.peu_editou = 1 THEN 'EDITOU'::text
            WHEN a1.peu_editou = 0 THEN 'NÃO EDITOU'::text
            ELSE 'NÃO EDITOU'::text
        END AS editou
   FROM pessoa x
     JOIN pessoa_pm a ON x.pes_codigo::text = a.pm_codigo::text AND (a.pts_codigo = ANY (ARRAY[1, 5]))
     LEFT JOIN pessoa_uniforme a1 ON a.pm_codigo::text = a1.pes_codigo::text
     JOIN unidade b ON b.uni_codigo = a.uni_codigo AND b.uni_lob = 2019
     JOIN graduacao c ON c.gra_codigo = a.gra_codigo
     LEFT JOIN situacao_pm d ON d.tsp_codigo = a.pts_codigo AND d.spm_codigo = a.pms_codigo
     LEFT JOIN corporativa e ON e.cor_sigla::text = d.spm_tipo::text AND e.cor_tipo::text = 'SITUACAO_TIPO'::text
     LEFT JOIN corporativa f ON f.cor_sigla::text = b.uni_regiao::text AND f.cor_tipo::text = 'UNIDADE_REGIAO'::text
     LEFT JOIN corporativa g ON g.cor_sigla::text = b.uni_tipo::text AND g.cor_tipo::text = 'TIPO_UNIDADE'::text
     LEFT JOIN municipio h ON h.mun_codigo::text = b.mun_codigo::text
     LEFT JOIN corporativa i ON i.cor_sigla::text = a.pm_grau_instrucao::text AND i.cor_tipo::text = 'ESCOLARIDADE'::text
     LEFT JOIN quadro j ON j.qua_codigo = a.qua_codigo
     LEFT JOIN unidade l ON l.uni_codigo = b.uni_grd_cmdo
     LEFT JOIN unidade m ON m.uni_codigo = b.uni_superior
     LEFT JOIN pm_funcao n ON a.pm_codigo::text = n.pes_codigo::text AND n.pmf_situacao::text = '01'::text
     LEFT JOIN funcao o ON n.fun_codigo = o.fun_codigo
     LEFT JOIN unidade p ON n.uni_codigo = p.uni_codigo
  ORDER BY b.uni_prioridade, (
        CASE
            WHEN d.spm_tipo::text = '4'::text THEN 1
            WHEN d.spm_tipo::text = ANY (ARRAY['2'::text, '3'::text, '5'::text]) THEN 2
            WHEN d.spm_tipo::text = '1'::text THEN 3
            ELSE 4
        END), a.gra_codigo;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW sisfard.v_dashboard_colog_dados`);
  }
}
