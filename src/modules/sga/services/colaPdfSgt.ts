import { Response } from 'express';
import PDFPrinter from 'pdfmake';
// eslint-disable-next-line
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { inject, injectable } from 'tsyringe';

import { VCandidato } from '@modules/sisprom/entities';
import {
  ICandidatosRepository,
  IPromocoesRepository,
} from '@modules/sisprom/repositories/interfaces';
import { AppError } from '@shared/errors/AppError';

import footerCeara from '../../../../imagens/footerCeara';
import logosHeader from '../../../../imagens/logosHeader';

interface IRequest {
  id_promocao: string;
  response: Response;
}

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

@injectable()
class CriarRelatorioPromocaoService {
  constructor(
    @inject('CandidatosRepository')
    private candidatosRepository: ICandidatosRepository,

    @inject('PromocoesRepository')
    private promocoesRepository: IPromocoesRepository,
  ) {}

  async execute({ id_promocao, response }: IRequest): Promise<void> {
    const promocaoExiste = await this.promocoesRepository.findById(id_promocao);

    if (!promocaoExiste) {
      throw new AppError('Promoção informada não existe!');
    }

    const candidatos3Figuracao = await this.candidatosRepository.findByPromocao3Figuracao(
      {
        id_promocao,
      },
    );

    const candidatos3FiguracaoArray = candidatos3Figuracao as VCandidato[];

    const candidatos3FiguracaoRows = candidatos3FiguracaoArray.map(
      (item, index) => {
        return [
          index + 1,
          item.classificacao,
          item.pm_numero,
          item.gra_sigla,
          item.pes_nome,
          item.pes_codigo,
        ];
      },
    );

    const candidatosAntiguidade = await this.candidatosRepository.findByPromocaoAntiguidade(
      {
        id_promocao,
      },
    );

    const candidatosAntiguidadeArray = candidatosAntiguidade as VCandidato[];

    const candidatosAntiguidadeRows = candidatosAntiguidadeArray.map(
      (item, index) => {
        return [
          index + 1,
          item.classificacao,
          item.pm_numero,
          item.gra_sigla,
          item.pes_nome,
          item.pes_codigo,
        ];
      },
    );

    const candidatosImpedidos = await this.candidatosRepository.findByImpedidos(
      {
        id_promocao,
      },
    );

    const candidatosImpedidosArray = candidatosImpedidos as VCandidato[];

    const candidatosImpedidosRows = candidatosImpedidosArray.map(
      (item, index) => {
        return [
          index + 1,
          item.classificacao,
          item.pm_numero,
          item.gra_sigla,
          item.pes_nome,
          item.pes_codigo,
        ];
      },
    );

    const candidatosClassificacao = await this.candidatosRepository.findByClassificacao(
      {
        id_promocao,
      },
    );

    const candidatosClassificacaoArray = candidatosClassificacao as VCandidato[];

    const candidatosClassificacaoRows = candidatosClassificacaoArray.map(
      (item, index) => {
        if (promocaoExiste.tipo_promocao.post_grad_atual >= 11) {
          return [
            index + 1,
            item.classificacao,
            item.pm_numero,
            item.gra_sigla,
            item.pes_nome,
            item.pes_codigo,
            item.pontos,
          ];
        }
        return [
          index + 1,
          item.classificacao,
          item.pm_numero,
          item.gra_sigla,
          item.pes_nome,
          item.pes_codigo,
          item.fifa_pontos,
          item.jcpo,
          item.pontos,
        ];
      },
    );

    const candidatosClassificacaoHeader =
      promocaoExiste.tipo_promocao.post_grad_atual >= 11
        ? ['ORD.', 'CLASS.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA', 'PTS']
        : [
            'ORD.',
            'CLASS.',
            'N°',
            'POST/GRAD',
            'NOME',
            'MATRICULA',
            'PP+PN',
            'JCPO',
            'PTS',
          ];

    const candidatosClassificacaoColumnsWidth =
      promocaoExiste.tipo_promocao.post_grad_atual >= 11
        ? ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto']
        : ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'];

    const candidatosMerecimento = await this.candidatosRepository.findByPromocaoMerecimento(
      {
        id_promocao,
      },
    );

    const candidatosMerecimentoArray = candidatosMerecimento as VCandidato[];

    const candidatosMerecimentoRows = candidatosMerecimentoArray.map(
      (item, index) => {
        if (promocaoExiste.tipo_promocao.post_grad_atual >= 11) {
          return [
            index + 1,
            item.classificacao,
            item.pm_numero,
            item.gra_sigla,
            item.pes_nome,
            item.pes_codigo,
            item.pontos,
          ];
        }
        return [
          index + 1,
          item.classificacao,
          item.pm_numero,
          item.gra_sigla,
          item.pes_nome,
          item.pes_codigo,
          item.fifa_pontos,
          item.jcpo,
          item.pontos,
        ];
      },
    );

    const candidatosMerecimentoHeader =
      promocaoExiste.tipo_promocao.post_grad_atual >= 11
        ? ['ORD.', 'CLASS.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA', 'PTS']
        : [
            'ORD.',
            'CLASS.',
            'N°',
            'POST/GRAD',
            'NOME',
            'MATRICULA',
            'PP+PN',
            'JCPO',
            'PTS',
          ];

    const candidatosMerecimentoColumnsWidth =
      promocaoExiste.tipo_promocao.post_grad_atual >= 11
        ? ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto']
        : ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'];

    const candidatosConcorrendo = await this.candidatosRepository.findByConcorrendo(
      {
        id_promocao,
      },
    );

    const candidatosConcorrendoArray = candidatosConcorrendo as VCandidato[];

    const candidatosConcorrendoRows = candidatosConcorrendoArray.map(
      (item, index) => {
        return [
          index + 1,
          item.classificacao,
          item.pm_numero,
          item.gra_sigla,
          item.pes_nome,
          item.pes_codigo,
        ];
      },
    );

    const candidatosGeral = await this.candidatosRepository.findByPromocao({
      id_promocao,
    });

    const candidatosGeralArray = candidatosGeral as VCandidato[];

    const candidatosGeralRows = candidatosGeralArray.map((item, index) => {
      return [
        index + 1,
        item.pm_numero,
        item.gra_sigla,
        item.pes_nome,
        item.pes_codigo,
        item.situacao,
      ];
    });

    try {
      const printer = new PDFPrinter(fonts);

      const data = new Date();

      const dataAno = data.getFullYear();
      const dataMes = String(data.getMonth() + 1).padStart(2, '0');
      const dataDia = String(data.getDate()).padStart(2, '0');
      const hora = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      const segundos = String(data.getSeconds()).padStart(2, '0');

      const docDefinitions: TDocumentDefinitions = {
        pageSize: 'A4',
        pageMargins: [30, 100, 30, 62],
        defaultStyle: { font: 'Helvetica', fontSize: 9, lineHeight: 1.3 },
        header: [
          {
            image: logosHeader,
            width: 240,
            alignment: 'center',
            margin: [0, 30],
          },
        ],
        footer(currentPage, pageCount) {
          return [
            {
              columns: [
                {
                  text: `SISPROM - ${dataDia}/${dataMes}/${dataAno} às ${hora}:${minutos}:${segundos}`,
                  margin: [30, 0, 0, 0],
                },
                {
                  text: `${currentPage.toString()} de ${pageCount}`,
                  alignment: 'right',
                  margin: [0, 0, 30, 0],
                },
              ],
            },
            { image: footerCeara, height: 50, width: 600 },
          ];
        },

        content: [
          {
            text: `RELATÓRIO DE QUADRO DE ACESSO`,
            bold: true,
            alignment: 'center',
          },
          {
            text: `TIPO QUADRO: ${promocaoExiste.tipo_quadro.sigla} - ${promocaoExiste.tipo_promocao.titulo}`,
            bold: true,
            margin: [0, 20, 0, 0],
          },
          {
            text: `ANO: ${promocaoExiste.ano}`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            text: `1 - GERAL:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', '*', 'auto', 'auto'],

              body: [
                ['ORD.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA', 'SITUAÇÃO'],
                ...candidatosGeralRows,
              ],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
          {
            text: `2 - 3º FIGURAÇÃO:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],

              body: [
                ['ORD.', 'CLASS.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA'],
                ...candidatos3FiguracaoRows,
              ],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
          {
            text: `3 - IMPEDIDOS:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],

              body: [
                ['ORD.', 'CLASS.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA'],
                ...candidatosImpedidosRows,
              ],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
          {
            text: `4 - CONCORRENDO:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],

              body: [
                ['ORD.', 'CLASS.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA'],
                ...candidatosConcorrendoRows,
              ],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
          {
            text: `5 - ANTIGUIDADE:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],

              body: [
                ['ORD.', 'CLASS.', 'N°', 'POST/GRAD', 'NOME', 'MATRICULA'],
                ...candidatosAntiguidadeRows,
              ],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
          {
            text: `6 - CLASSIFICAÇÂO:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: candidatosClassificacaoColumnsWidth,

              body: [
                candidatosClassificacaoHeader,
                ...candidatosClassificacaoRows,
              ],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
          {
            text: `7 - MERECIMENTO:`,
            bold: true,
            margin: [0, 10, 0, 0],
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: candidatosMerecimentoColumnsWidth,

              body: [candidatosMerecimentoHeader, ...candidatosMerecimentoRows],
            },
            margin: [0, 2, 0, 0],
            lineHeight: 1,
            fontSize: 7,
          },
        ], // fim content
        styles: {
          header: {
            margin: [0, 0, 0, 0],
          },
        },
      };

      const options = {};

      const pdfDoc = printer.createPdfKitDocument(docDefinitions, options);

      const chunks: Uint8Array[] = [];

      pdfDoc.on('data', chunk => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        response.end(result);
      });
      pdfDoc.end();
    } catch (error) {
      throw new AppError('Ocorreu um erro ao gerar o relatório');
    }
  }
}

export { CriarRelatorioPromocaoService };
