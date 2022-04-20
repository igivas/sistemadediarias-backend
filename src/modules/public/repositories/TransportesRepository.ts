import { getRepository, Raw, Repository } from 'typeorm';
import ICreateTransporteDTO from '../dtos/ICreateTransporteDTO';
import IDeleteTransporteDTO from '../dtos/IDeleteTransporte';
import IUpdateTransporteDTO from '../dtos/IUpdateTransporteDTO';
import Transporte from '../entities/Transporte';

import ITransportesRepository from './interfaces/ITransportesRepository';

class TransportesRepository implements ITransportesRepository {
  private transporteRepository: Repository<Transporte>;

  constructor() {
    this.transporteRepository = getRepository(Transporte);
  }

  public async findByNome(nome: string): Promise<Transporte | undefined> {
    return this.transporteRepository.findOne({
      where: {
        descricao_tran: Raw(
          nomeDB => `LOWER(TRIM(${nomeDB})) ilike lower(TRIM('${nome}'))`,
        ),
      },
    });
  }

  public async create({
    descricao_tran,
    situacao_tran,
    usuario_cadastro,
  }: ICreateTransporteDTO): Promise<Transporte> {
    const transporte = this.transporteRepository.create({
      descricao_tran,
      situacao_tran,
      usuario_cadastro,
      data_cadastro: new Date(),
    });

    const novoTransporte = await this.transporteRepository.save(transporte);

    return novoTransporte;
  }

  public async listTransporte(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ transportes: Transporte[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      wherePersonalizado = [
        {
          descricao_tran: Raw(
            nomeTransporte => `LOWER(${nomeTransporte}) ILIKE '%${query}%'`,
          ),
          deletado_tran: 0,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          deletado_tran: 0,
        },
      ];
    }

    const [consulta, total] = await this.transporteRepository.findAndCount({
      where: wherePersonalizado,
      order: {
        id_tran: 'ASC',
      },
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { transportes: consulta, total };
  }

  public async update(
    transporte: Transporte,
    newData: IUpdateTransporteDTO,
  ): Promise<Transporte> {
    const transporteUpdate = this.transporteRepository.merge(transporte, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.transporteRepository.save(transporteUpdate);

    return transporteUpdate;
  }

  public async softDelete(
    transporte: Transporte,
    newData: IDeleteTransporteDTO,
  ): Promise<Transporte> {
    const transporteUpdate = this.transporteRepository.merge(transporte, {
      deletado_tran: 1,
      data_alteracao: new Date(),
      usuario_alteracao: newData.usuario_alteracao,
    });

    await this.transporteRepository.save(transporteUpdate);

    return transporteUpdate;
  }

  public async findById(id: number): Promise<Transporte | undefined> {
    const transporte = await this.transporteRepository.findOne({
      where: {
        id_tran: id,
        deletado_tran: 0,
      },
    });

    return transporte;
  }
}

export default TransportesRepository;
