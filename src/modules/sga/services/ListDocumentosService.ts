import { injectable, inject } from 'tsyringe';
import Documento from '../entities/Documento';
import IDocumentosRepository from '../repositories/interfaces/IDocumentosRepository';

/**
 * Service que ainda deve ser implementado
 * listando documentos para assinar
 */

@injectable()
class ListDocumentosService {
  constructor(
    @inject('DocumentosRepository')
    private documentosRepository: IDocumentosRepository,
  ) {}

  public async execute(
    cpf: string,
    opm: number | undefined,
  ): Promise<Documento[] | undefined> {
    let documentos = [] as Documento[] | undefined;

    if (opm) {
      documentos = await this.documentosRepository.findDocumentosByOpm(opm);
    } else {
      documentos = await this.documentosRepository.findDocumentosByInteressado(
        cpf,
      );
    }

    const documentosNaoAssinados = documentos?.filter(documento => {
      const { assinaturas } = documento;
      if (
        assinaturas &&
        assinaturas.find(assinatura => assinatura.cpf === cpf)
      ) {
        return false;
      }
      return true;
    });

    return documentosNaoAssinados;
  }
}

export default ListDocumentosService;
