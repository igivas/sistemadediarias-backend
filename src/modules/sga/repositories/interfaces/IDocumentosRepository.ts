import Documento from '../../entities/Documento';
import ICreateDocumentoDTO from '../../dtos/ICreateDocumentoDTO';
import IUpdateDocumentoDTO from '../../dtos/IUpdateDocumentoDTO';

export default interface IDocumentosRepository {
  create(documento: ICreateDocumentoDTO): Promise<Documento>;
  update(
    documento: Documento,
    novosDados: IUpdateDocumentoDTO,
  ): Promise<Documento>;
  // updateReassinar(
  //   documento: Documento,
  //   novosDados: IUpdateDocumentoDTO,
  //   idsAssinaturas: number[],
  // ): Promise<Documento>;
  findByIdDocumento(id_documento: number): Promise<Documento | undefined>;
  findDocumentosByOpm(opm: number): Promise<Documento[] | undefined>;
  findDocumentosByInteressado(cpf: string): Promise<Documento[] | undefined>;
  findBySistemaAndDocumento(
    id_sistema: number,
    id_tipo_documento: number,
    id_documento_origem: number,
  ): Promise<Documento | undefined>;
  findById(id: number): Promise<Documento | undefined>;
  findByIds(ids: number[]): Promise<Documento[] | undefined>;
  findByIdWithAssinaturas(id: number): Promise<Documento | undefined>;
  findByVerificador(verificador: string): Promise<Documento | undefined>;
}
