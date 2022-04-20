import { injectable } from 'tsyringe';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import Path from 'path';
import crypto from 'crypto';
import { format } from 'date-fns';
import { getConnection } from 'typeorm';
import Documento from '../entities/Documento';
import AssinaturaDocumento from '../entities/AssinaturaDocumento';
import Assinatura from '../entities/Assinatura';

const TiposAssinaturas = {
  '0': '',
  '1': 'por ordem,',
  '2': 'por impedimento,',
};

interface IRequest {
  documento: Documento;
  assinatura: Assinatura;
  tipo_assinatura: '0' | '1' | '2';
}

interface IResponse extends Documento {
  assinaturas: any;
  url: string;
}

interface IResponsePreparaDocumento {
  assinaturaObject: any;
  documentoObject: any;
  dirPath: string;
  fullPath: string;
  fullPathLink: string;
  pdfBytes: any;
}

@injectable()
class AssinarDocumentoService {
  async execute({
    documento,
    tipo_assinatura,
    assinatura,
  }: IRequest): Promise<IResponse | undefined> {
    const preparaDocumento = async (): Promise<IResponsePreparaDocumento> => {
      const fullPath = Path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'documentos',
        documento.path,
      );

      const pdfDoc = await PDFDocument.load(fs.readFileSync(`${fullPath}.pdf`));

      const generateQR = async (text: string): Promise<string> => {
        try {
          return await QRCode.toDataURL(text);
        } catch (err) {
          console.error(err);
          return err;
        }
      };

      const baseUrl = `${process.env.API_BASE_URL}`;
      const fullPathLink = `${baseUrl}/documentos/pdf${documento.path}`;

      const qrImage = await generateQR(`${fullPathLink}`);

      const cpfsAnteriores = documento.assinaturas
        ? documento.assinaturas.map(assin => assin.cpf)
        : [];

      const cpfs = [...cpfsAnteriores, assinatura.cpf];

      pdfDoc.setAuthor(`Assinado por ${cpfs}`);

      pdfDoc.setProducer('SISTEMA GESTOR DE ASSINATURAS - SGA');

      const QrImage = await pdfDoc.embedPng(qrImage);
      const SecureImage = await pdfDoc.embedPng(
        fs.readFileSync(Path.join(__dirname, '..', 'images', 'sga-secure.png')),
      );

      const novaAssinatura = {
        cpf: assinatura.cpf,
        tipo_assinatura,
        criado_em: new Date(),
        pes_codigo: assinatura.pes_codigo,
        pessoa: { pes_nome: assinatura.pessoa.pes_nome },
      };

      const assinaturas = documento.assinaturas
        ? [...documento.assinaturas, novaAssinatura]
        : [novaAssinatura];

      const pages = pdfDoc.getPages();

      const lastPage = pages[documento.qtd_pg_documento_original - 1];

      const formatData = (date: Date): string => {
        return format(date, 'dd/MM/yyyy HH:mm:ss');
      };

      lastPage.drawRectangle({
        x: 25,
        y: 15,
        width: lastPage.getWidth() - 50,
        height: 110,
        color: rgb(1, 1, 1),
      });

      lastPage.drawText(`ASSINADO ELETRONICAMENTE POR: `, {
        x: 30,
        y: 115,
        size: 8,
      });

      for (let i = 0; i < assinaturas.length && i < 5; i += 1) {
        lastPage.drawText(
          `- ${assinaturas[i].pessoa.pes_nome}, CPF.: ${assinaturas[i].cpf}, ${
            TiposAssinaturas[assinaturas[i].tipo_assinatura]
          } em ${formatData(assinaturas[i].criado_em)}.`,
          {
            x: 30,
            y: 105 - i * 10,
            size: 8,
          },
        );
      }

      for (
        let i = 0;
        i < documento.qtd_pg_documento_original && i < 5;
        i += 1
      ) {
        pages[i].drawRectangle({
          x: 25,
          y: 15,
          width: pages[i].getWidth() - 50,
          height: 45,
          color: rgb(1, 1, 1),
        });

        pages[i].drawImage(QrImage, {
          x: pages[i].getWidth() - 75,
          y: 10,
          width: 45,
          height: 45,
        });

        pages[i].drawImage(SecureImage, {
          x: 30,
          y: 20,
          width: 52,
          height: 35,
        });
        const footerTitle = `Para verificar a autenticidade do documento acesse https://sga.pm.ce.gov.br/verificador `;

        pages[i].drawText(footerTitle, {
          x: pages[i].getWidth() / 2 - footerTitle.length * 1.75,
          y: 45,
          size: 8,
        });

        const footerSubtitle = `utilizando o código ${documento.verificador.toUpperCase()} ou utilize o qr code ao lado.`;

        pages[i].drawText(footerSubtitle, {
          x: pages[i].getWidth() / 2 - footerSubtitle.length * 1.75,
          y: 35,
          size: 8,
        });

        const tipoDocumento = `--- ${documento.tipo_documento} - ${
          documento.numero_documento
        } - Página ${i + 1} ---`;

        pages[i].drawText(tipoDocumento, {
          x: pages[i].getWidth() / 2 - tipoDocumento.length * 1.75,
          y: 25,
          size: 8,
        });
      }

      const naoPossuiPaginaAdicional =
        pages.length === documento.qtd_pg_documento_original;

      if (assinaturas.length > 5) {
        const pageAdicional = naoPossuiPaginaAdicional
          ? pdfDoc.addPage()
          : pages[documento.qtd_pg_documento_original];
        const { height } = pageAdicional.getSize();

        pageAdicional.drawRectangle({
          x: 25,
          y: height - (height - 15),
          width: pageAdicional.getWidth() - 50,
          height: pageAdicional.getHeight() - 35,
          color: rgb(1, 1, 1),
        });

        pageAdicional.drawText(`ASSINADO ELETRONICAMENTE POR: `, {
          x: 30,
          y: height - 30,
          size: 8,
        });

        for (let i = 5; i < assinaturas.length && i >= 5; i += 1) {
          pageAdicional.drawText(
            `- ${assinaturas[i].pessoa.pes_nome}, CPF.: ${
              assinaturas[i].cpf
            },  ${
              TiposAssinaturas[assinaturas[i].tipo_assinatura]
            } em ${formatData(assinaturas[i].criado_em)}.`,
            {
              x: 30,
              y: height - 40 - (i - 5) * 10,
              size: 8,
            },
          );
        }

        pageAdicional.drawImage(QrImage, {
          x: pageAdicional.getWidth() - 75,
          y: 10,
          width: 45,
          height: 45,
        });

        pageAdicional.drawImage(SecureImage, {
          x: 30,
          y: 20,
          width: 52,
          height: 35,
        });
        const footerTitle = `Para verificar a autenticidade do documento acesse https://sga.pm.ce.gov.br/verificador `;

        pageAdicional.drawText(footerTitle, {
          x: pageAdicional.getWidth() / 2 - footerTitle.length * 1.75,
          y: 45,
          size: 8,
        });

        const footerSubtitle = `utilizando o código ${documento.verificador.toUpperCase()} ou utilize o qr code ao lado.`;

        pageAdicional.drawText(footerSubtitle, {
          x: pageAdicional.getWidth() / 2 - footerSubtitle.length * 1.75,
          y: 35,
          size: 8,
        });

        const tipoDocumento = `--- ${documento.tipo_documento} - ${
          documento.numero_documento
        } - Página ${documento.qtd_pg_documento_original + 1} ---`;

        pageAdicional.drawText(tipoDocumento, {
          x: pageAdicional.getWidth() / 2 - tipoDocumento.length * 1.75,
          y: 25,
          size: 8,
        });
      }

      const pdfBytes = await pdfDoc.save();

      const sumSha1 = crypto.createHash('sha1');
      const sumMd5 = crypto.createHash('md5');

      sumSha1.update(pdfBytes);
      sumMd5.update(pdfBytes);

      const hash_sha1 = sumSha1.digest('hex');
      const hash_md5 = sumMd5.digest('hex');

      const dirPath = fullPath.replace(documento.verificador, '');

      const documentoObject = {
        hash_sha1,
        hash_md5,
        assinado: true,
      };

      const assinaturaObject = {
        id_documento: documento.id_documento,
        cpf: assinatura.cpf,
        pes_codigo: assinatura.pes_codigo,
        tipo_assinatura,
        hash_sha1,
        hash_md5,
      };

      return {
        assinaturaObject,
        documentoObject,
        dirPath,
        fullPath,
        pdfBytes,
        fullPathLink,
      };
    };

    let resposta: any = {};

    const createDocumentoTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const {
          assinaturaObject,
          documentoObject,
          dirPath,
          fullPath,
          pdfBytes,
          fullPathLink,
        } = await preparaDocumento();
        const documentoAtualizado = queryRunner.manager.merge(
          Documento,
          documento,
          documentoObject,
        );

        const documentoAssinado = await queryRunner.manager.save(
          documentoAtualizado,
        );

        const assinaturaCriada = queryRunner.manager.create(
          AssinaturaDocumento,
          assinaturaObject,
        );

        const assinaturaAtual = await queryRunner.manager.save(
          assinaturaCriada,
        );
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(`${dirPath}`, { recursive: true });
        }

        fs.writeFileSync(`${fullPath}.pdf`, pdfBytes);
        resposta = { assinaturaAtual, documentoAssinado, fullPathLink };

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        resposta = undefined;
      } finally {
        await queryRunner.release();
      }
    };

    await createDocumentoTransaction();

    if (resposta) {
      return {
        ...resposta.documentoAssinado,
        assinaturas: [
          ...resposta.documentoAssinado.assinaturas,
          resposta.assinaturaAtual,
        ],
        url: resposta.fullPathLink,
      };
    }
    return undefined;
  }
}

export default AssinarDocumentoService;
