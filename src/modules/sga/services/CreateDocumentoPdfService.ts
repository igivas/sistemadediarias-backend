/* import PDFDocument from 'pdfkit-table';
import getStream from 'get-stream';
import { container, injectable } from 'tsyringe';
import path from 'path';
import MostrarItemService from '@modules/sisfard/services/MostrarItemService';
import { format } from 'date-fns';
import ListarEstoqueDataTable from '@modules/sisfard/services/ListarEstoqueDataTable';
import footerCeara from '../../../imagens/footerCeara';
import logosHeader from '../../../imagens/logosHeader';

@injectable()
class CreateDocumentoPdfService {
  constructor() {}

  async execute(data: any): Promise<Buffer> {
    const listarEstoqueDataTable = container.resolve(ListarEstoqueDataTable);

    const { items } = await listarEstoqueDataTable.execute(1, 5000);

    const pdf = new PDFDocument({
      bufferPages: true,
      size: 'A4',
      margins: {
        top: 30,
        bottom: 100,
        left: 60,
        right: 62,
      },
    });

    let i;
    let end;

    pdf.image(logosHeader, 160, 30, {
      scale: 0.7,
    });
    const logoEstado = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      'images',
      'ondas.png',
    );

    pdf.image(logoEstado, 0, 800, {
      scale: 0.35,
    });

    pdf.font('Times-Roman').fontSize(12);
    pdf.moveDown(7);
    pdf.text(`Termo ${data.termo}`, {
      align: 'left',
    });
    pdf.moveDown(1);
    pdf.text(`Data:${new Date().toLocaleDateString('pt-BR')}`, {
      align: 'right',
    });

    pdf.moveDown(3);
    pdf.text(
      `Eu, ${data.nomeRecebedor} pertencente a opm ${data.opm} recebi os seguintes itens de fardamento discrimanados abaixo`,
      {
        align: 'left',
      },
    );

    pdf.moveDown(0.125);
    pdf.moveDown(1.5);

    pdf.font('Times-Bold').fontSize(15).text('Itens de Fardamento', {
      align: 'center',
    });
    pdf.moveDown(2);
    pdf.font('Times-Roman');
    const dadosTable = data.itens.map((obj: any, index: number) => {
      return {
        Ordem: index + 1,
        Item: items.find((objeto: any) => objeto.id_item === obj.id_item)
          ?.pesquisa,
        Quantidade: obj.quantidade,
      };
    });

    const table = {
      headers: [
        {
          label: 'Ordem',
          property: 'Ordem',
          align: 'center',
          width: 30,
          renderer: null,
        },
        {
          label: 'Item',
          align: 'center',
          property: 'Item',
          width: 350,
          renderer: null,
        },
        {
          label: 'Quantidade',
          property: 'Quantidade',
          align: 'center',
          width: 80,
          renderer: null,
        },
      ],

      datas: dadosTable,
    };

    pdf.table(table, {
      prepareHeader: () => pdf.fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        // eslint-disable-next-line no-unused-expressions
        indexColumn === 0 && pdf.addBackground(rectRow, 'white', 0.15);
      },
    });

    pdf.moveDown(1.5);
    pdf
      .fontSize(15)
      .text(`Pagamento Realizado por ${data.nomePagador}`, undefined, 670, {
        align: 'center',
        indent: 10,
      });
    pdf.fontSize(15).text(`MF:. ${data.matriculaPagador}`, undefined, 690, {
      align: 'center',
      indent: 10,
    });

    const pages = pdf.bufferedPageRange();
    for (
      i = pages.start, end = pages.start + pages.count, pages.start <= end;
      i < end;
      i++
    ) {
      pdf.switchToPage(i);
      pdf.image(logoEstado, 0, 800, {
        scale: 0.35,
      });
    }

    pdf.end();

    const documento = await getStream.buffer(pdf);

    return documento;
  }
}

export default CreateDocumentoPdfService;
 */
import PDFDocument from 'pdfkit-table';
import getStream from 'get-stream';
import { container, injectable } from 'tsyringe';
import PDFPrinter from 'pdfmake';
import path from 'path';
import MostrarItemService from '@modules/sisfard/services/MostrarItemService';
import { format } from 'date-fns';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import footerCeara from '../../../imagens/footerCeara';
import logosHeader from '../../../imagens/logosHeader';

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

interface IDadosMunicipio {
  mun_codigo: number;
  mun_nome: string;
}

interface IDadosUnidade {
  uni_codigo: number;
  uni_nome: string;
  uni_sigla: string;
  uni_superior: number;
  uni_grd_cmdo: number;
  uni_lob: number;
  municipio: IDadosMunicipio;
}

interface IDadosPolicialPagador {
  matricula: string;
  graduacao: string;
  nome: string;
  cpf: string;
  opm: any;
}

interface IDadosDocumento {
  nomeRecebedor: string;
  opmRecebedorNome: string;
  unidadePagadora: IDadosUnidade;
  policialPagador: any;
  municipioOpm: string;
  opmRecebedor: string;
  policialPesquisadoRecebedor: any;
  nomePagador: string;
  unidadeRecebedora: IDadosUnidade;
  matriculaPagador: string;
  matriculaRecebedor: string;
  data_saida: string;
  termo: string;
  itens: any;
}

@injectable()
class CreateDocumentoPdfService {
  constructor() {}

  async execute(data: IDadosDocumento): Promise<Buffer> {
    const itensFormat = data.itens.map((objeto, index) => {
      return [index + 1, objeto.label, objeto.quantidade];
    });

    const printer = new PDFPrinter(fonts);

    const docDefinitions: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [30, 100, 30, 120],
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
            columns: [],
          },
          { image: footerCeara, height: 50, width: 600, margin: [0, 60, 0, 0] },
        ];
      },

      content: [
        {
          text: `Termo de Entrega de Fardamento Nº: ${data.termo}`,
          decoration: 'underline',
          bold: true,
          alignment: 'center',
          fontSize: 18,
        },
        {
          text: `${data.municipioOpm}, ${format(new Date(), 'dd/MM/yyyy')}`,

          alignment: 'right',
          margin: [0, 50, 0, 0],
        },
        {
          text: `Eu, ${data.nomeRecebedor} pertencente a OPM ${data.opmRecebedor} recebi os seguintes itens de fardamento discriminados abaixo da unidade ${data.unidadePagadora.uni_nome}`,
          fontSize: 11,
          alignment: 'justify',
          margin: [0, 30, 0, 0],
        },
        {
          text: `Itens de fardamento entregues:`,
          bold: true,
          alignment: 'center',
          margin: [0, 30, 0, 0],
          fontSize: 16,
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', 'auto', 'auto'],

            body: [['ORD.', 'ITEM.', 'QUANTIDADE'], ...itensFormat],
          },
          margin: [20, 15, 0, 0],
          alignment: 'center',
          lineHeight: 1,
          fontSize: 9,
        },
        {
          columns: [
            {
              stack: [
                // second column consists of paragraphs
                `${data.policialPesquisadoRecebedor.pessoa.pes_nome} - ${data.policialPesquisadoRecebedor.graduacao.gra_sigla}`,
                `MF: ${data.policialPesquisadoRecebedor.pm_codigo}`,
                `${data.unidadeRecebedora.uni_sigla}`,
                'Recebedor',
              ],
              alignment: 'center',
              bold: true,
              margin: [0, 15, 0, 0],
              fontSize: 10,
            },

            {
              stack: [
                // second column consists of paragraphs
                `${data.policialPagador.nome} - ${data.policialPagador.graduacao}`,
                `MF: ${data.policialPagador.matricula}`,
                `${data.unidadePagadora.uni_sigla}`,
                'Encarregado pelo pagamento',
              ],
              alignment: 'center',
              bold: true,
              margin: [0, 15, 0, 0],
              fontSize: 10,
            },
          ],
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
    pdfDoc.end();
    const documento = await getStream.buffer(pdfDoc);

    return documento;
  }
}

export default CreateDocumentoPdfService;
