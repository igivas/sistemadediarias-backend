import { getRepository, Repository } from 'typeorm';

import IAssinaturasDocumentosRepository from './interfaces/IAssinaturasDocumentosRepository';
import AssinaturaDocumento from '../entities/AssinaturaDocumento';
import ICreateAssinaturaDocumentoDTO from '../dtos/ICreateAssinaturaDocumentoDTO';
import IUpdateAssinaturaDocumentoDTO from '../dtos/IUpdateAssinaturaDocumentoDTO';

class AssinaturasDocumentosRepository
  implements IAssinaturasDocumentosRepository {
  private ormRepository: Repository<AssinaturaDocumento>;

  constructor() {
    this.ormRepository = getRepository(AssinaturaDocumento);
  }

  public async create(
    assinaturaDocumento: ICreateAssinaturaDocumentoDTO,
  ): Promise<AssinaturaDocumento> {
    const novaAssinatura = this.ormRepository.create(assinaturaDocumento);

    const assinatura = this.ormRepository.save(novaAssinatura);

    return assinatura;
  }

  public async update(
    assinaturaDocumento: AssinaturaDocumento,
    novosDados: IUpdateAssinaturaDocumentoDTO,
  ): Promise<AssinaturaDocumento> {
    const assinaturaUpdated = this.ormRepository.merge(
      assinaturaDocumento,
      novosDados,
    );

    const assinatura = this.ormRepository.save(assinaturaUpdated);

    return assinatura;
  }

  public async findById(
    id_assinatura_documento: number,
  ): Promise<AssinaturaDocumento | undefined> {
    const assinatura = this.ormRepository.findOne({
      where: {
        id_assinatura_documento,
      },
    });

    return assinatura;
  }

  public async findByDocumento(
    id_documento: number,
  ): Promise<AssinaturaDocumento | undefined> {
    const assinatura = this.ormRepository.findOne({
      where: {
        id_documento,
      },
    });

    return assinatura;
  }
}

export default AssinaturasDocumentosRepository;
