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

interface IDadosUnidadeRecebedora {
  uni_codigo: number;
  uni_nome: string;
  uni_sigla: string;
  uni_superior: number;
  uni_grd_cmdo: number;
  uni_lob: number;
  municipio: IDadosMunicipio;
}

interface IDadosDocumento {
  nomeRecebedor: string;
  opmRecebedorNome: string;
  policialPagador: any;
  municipioOpm: string;
  opmRecebedor: string;
  policialPesquisadoRecebedor: any;
  nomePagador: string;
  unidadeRecebedora: IDadosUnidadeRecebedora;
  matriculaPagador: string;
  matriculaRecebedor: string;
  data_saida: string;
  termo: string;
  itens: any;
}

@injectable()
class CreateDocumentoPdfCologOpmService {
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
          {
            image: footerCeara,
            height: 80,
            width: 600,
            margin: [0, 60, 0, 0],
          },
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
          /* text: `Fortaleza, ${new Date().toLocaleDateString('pt-BR')}`, */
          text: `Fortaleza, ${format(new Date(), 'dd/MM/yyyy')}`,

          alignment: 'right',
          margin: [0, 50, 0, 0],
        },
        {
          text: `Eu, ${data.nomeRecebedor} pertencente a OPM ${data.opmRecebedor} recebi os seguintes itens de fardamento discriminados abaixo para integrarem o estoque interno da unidade ${data.opmRecebedorNome}`,
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
                `COLOG`,
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
    };

    const options = {};
    const pdfDoc = printer.createPdfKitDocument(docDefinitions, options);
    pdfDoc.end();
    const documento = await getStream.buffer(pdfDoc);

    return documento;
  }
}

export default CreateDocumentoPdfCologOpmService;
