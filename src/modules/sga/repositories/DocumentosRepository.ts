import { getRepository, ILike, Repository } from 'typeorm';

import IDocumentosRepository from './interfaces/IDocumentosRepository';
import Documento from '../entities/Documento';
import ICreateDocumentoDTO from '../dtos/ICreateDocumentoDTO';
import IUpdateDocumentoDTO from '../dtos/IUpdateDocumentoDTO';

class DocumentosRepository implements IDocumentosRepository {
  private ormRepository: Repository<Documento>;

  constructor() {
    this.ormRepository = getRepository(Documento);
  }

  public async create(dados: ICreateDocumentoDTO): Promise<Documento> {
    const novoDocumento = this.ormRepository.create(dados);

    const documento = this.ormRepository.save(novoDocumento);

    return documento;
  }

  public async update(
    documento: Documento,
    newData: IUpdateDocumentoDTO,
  ): Promise<Documento> {
    const documentoAtualizado = this.ormRepository.merge(documento, newData);

    return this.ormRepository.save(documentoAtualizado);
  }

  public async findByIdDocumento(
    id_documento: number,
  ): Promise<Documento | undefined> {
    const assinatura = this.ormRepository.findOne({
      where: {
        id_documento,
      },
    });

    return assinatura;
  }

  public async findDocumentosByOpm(
    opm: number,
  ): Promise<Documento[] | undefined> {
    const assinatura = this.ormRepository.find({
      where: {
        opm_interessado: opm,
      },
      relations: ['assinaturas'],
    });

    return assinatura;
  }

  public async findDocumentosByInteressado(
    cpf: string,
  ): Promise<Documento[] | undefined> {
    const assinatura = this.ormRepository.find({
      where: {
        cpfs_interessados: ILike(`%${cpf}%`),
      },
      relations: ['assinaturas'],
    });

    return assinatura;
  }

  public async findBySistemaAndDocumento(
    id_sistema: number,
    id_tipo_documento: number,
    id_documento_origem: number,
  ): Promise<Documento | undefined> {
    const documento = await this.ormRepository.findOne({
      where: {
        id_sistema,
        id_tipo_documento,
        id_documento_origem,
      },
      relations: ['assinaturas', 'assinaturas.pessoa'],
    });

    return documento;
  }

  public async findById(id: number): Promise<Documento | undefined> {
    const documento = this.ormRepository.findOne(id);

    return documento;
  }

  public async findByIds(ids: number[]): Promise<Documento[] | undefined> {
    const documentos = this.ormRepository.findByIds(ids);

    return documentos;
  }

  public async findByIdWithAssinaturas(
    id_documento: number,
  ): Promise<Documento | undefined> {
    const documento = this.ormRepository.findOne({
      where: {
        id_documento,
      },
      relations: ['assinaturas', 'assinaturas.pessoa'],
    });

    return documento;
  }

  public async findByVerificador(
    verificador: string,
  ): Promise<Documento | undefined> {
    const documento = await this.ormRepository.findOne({
      select: [
        'id_documento',
        'id_documento_origem',
        'verificador',
        'id_sistema',
        'hash_md5',
        'hash_sha1',
        'numero_documento',
        'path',
        'tipo_documento',
        'criado_em',
      ],
      where: {
        verificador,
      },
      relations: ['assinaturas', 'assinaturas.pessoa'],
    });
    return documento;
  }
}

export default DocumentosRepository;
