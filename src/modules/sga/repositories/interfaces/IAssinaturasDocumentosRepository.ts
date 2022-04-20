import AssinaturaDocumento from '../../entities/AssinaturaDocumento';
import ICreateAssinaturaDocumentoDTO from '../../dtos/ICreateAssinaturaDocumentoDTO';
import IUpdateAssinaturaDocumentoDTO from '../../dtos/IUpdateAssinaturaDocumentoDTO';

export default interface IAssinaturasRepository {
  create(
    assinatura: ICreateAssinaturaDocumentoDTO,
  ): Promise<AssinaturaDocumento>;
  update(
    assinatura: AssinaturaDocumento,
    novosDados: IUpdateAssinaturaDocumentoDTO,
  ): Promise<AssinaturaDocumento>;
  findById(id: number): Promise<AssinaturaDocumento | undefined>;
  findByDocumento(
    id_documento: number,
  ): Promise<AssinaturaDocumento | undefined>;
}
