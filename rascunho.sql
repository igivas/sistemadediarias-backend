        create or replace view sisfard.relatorio_quantitativo as (        (        (        (        (        (         SELECT random() AS id_virtual, 
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
                                           GROUP BY a.peu_blusa_interna, c.uni_superior, c.uni_grd_cmdo, c.uni_prioridade, b.uni_codigo, m.uni_sigla, c.uni_sigla)
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
                                   GROUP BY a.peu_gandola, c.uni_superior, c.uni_grd_cmdo, c.uni_prioridade, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_gandola_sexo)
                                UNION 
                                         SELECT random() AS id_virtual, 
                                            c.uni_prioridade AS prioridade, 
                                            c.uni_sigla AS opm_nm, 
                                            c.uni_superior, c.uni_grd_cmdo, 
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
                           GROUP BY a.peu_gandola, c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_gandola_sexo)
                        UNION 
                                 SELECT random() AS id_virtual, 
                                    c.uni_prioridade AS prioridade, 
                                    c.uni_sigla AS opm_nm, c.uni_superior, 
                                    c.uni_grd_cmdo, b.uni_codigo, 
                                    m.uni_sigla AS opm_superior, 
                                    'calça - Masculina'::text AS peca, 
                                    a.peu_calca::text AS tamanho, 
                                    count(a.pes_codigo) AS quantidade
                                   FROM pessoa_uniforme a
                              LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                         LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
                    LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
                   WHERE a.peu_editou = 1 AND a.peu_calca_sexo = 'M'::bpchar
                   GROUP BY c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_calca)
                UNION 
                         SELECT random() AS id_virtual, 
                            c.uni_prioridade AS prioridade, 
                            c.uni_sigla AS opm_nm, c.uni_superior, 
                            c.uni_grd_cmdo, b.uni_codigo, 
                            m.uni_sigla AS opm_superior, 
                            'calça - Feminina'::text AS peca, 
                            a.peu_calca::text AS tamanho, 
                            count(a.pes_codigo) AS quantidade
                           FROM pessoa_uniforme a
                      LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
                 LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
            LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
           WHERE a.peu_editou = 1 AND a.peu_calca_sexo = 'F'::bpchar
           GROUP BY c.uni_prioridade, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, m.uni_sigla, c.uni_sigla, a.peu_calca)
        UNION 
                 SELECT random() AS id_virtual, 
                    c.uni_prioridade AS prioridade, c.uni_sigla AS opm_nm, 
                    c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, 
                    m.uni_sigla AS opm_superior, 'cobertura'::text AS peca, 
                    a.peu_cabeca::text AS tamanho, 
                    count(a.pes_codigo) AS quantidade
                   FROM pessoa_uniforme a
              LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
         LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
    LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
   WHERE a.peu_editou = 1
   GROUP BY c.uni_prioridade, b.uni_codigo, c.uni_superior, c.uni_grd_cmdo, m.uni_sigla, c.uni_sigla, a.peu_cabeca)
UNION 
         SELECT random() AS id_virtual, c.uni_prioridade AS prioridade, 
            c.uni_sigla AS opm_nm, c.uni_superior, c.uni_grd_cmdo, b.uni_codigo, 
            m.uni_sigla AS opm_superior, 'coldre'::text AS peca, 
            a.peu_coldre::text AS tamanho, count(a.pes_codigo) AS quantidade
           FROM pessoa_uniforme a
      LEFT JOIN pessoa_pm b ON a.pes_codigo::text = b.pm_codigo::text
   LEFT JOIN unidade c ON b.uni_codigo = c.uni_codigo AND c.uni_lob = 2019
   LEFT JOIN unidade m ON m.uni_codigo = c.uni_superior
  WHERE a.peu_editou = 1
  GROUP BY c.uni_prioridade, b.uni_codigo, c.uni_superior, c.uni_grd_cmdo, m.uni_sigla, c.uni_sigla, a.peu_coldre
  order by prioridade,uni_codigo,peca,tamanho


  create view  sisfard.v_lista_fardamento as
SELECT d.pm_numero, a.peu_cabeca, a.peu_calca, a.peu_codigo, e.gra_nome, 
    a.peu_sapato, a.peu_gandola, a.peu_blusa_interna, a.peu_coldre, 
    a.peu_calca_sexo, a.peu_gandola_sexo, a.data_alteracao, c.uni_codigo, 
    d.gra_codigo, c.uni_sigla, d.pm_codigo, d.pm_apelido, e.gra_sigla, 
        CASE
            WHEN a.peu_editou = 1 THEN 'ATUALIZADO'::character varying
            ELSE 'PENDENTE'::character varying
        END AS editou, 
		 CASE
            WHEN d.pm_sexo = 'M' THEN 'Masculino'::character varying
			WHEN d.pm_sexo = 'F' THEN 'Feminino'::character varying
            ELSE 'Nao Informado'::character varying
        END AS pm_sexo, 
    c.uni_superior, c.uni_grd_cmdo
   FROM pessoa_uniforme a
   JOIN pessoa_pm d ON a.pes_codigo::text = d.pm_codigo::text AND (d.pts_codigo = ANY (ARRAY[1, 5]))
   LEFT JOIN unidade c ON d.uni_codigo::text = c.uni_codigo::text AND c.uni_lob = 2019
   LEFT JOIN graduacao e ON d.gra_codigo = e.gra_codigo
  WHERE a.unf_codigo = 1
  ORDER BY e.gra_prioridade, d.pm_numero