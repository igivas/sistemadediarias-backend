import { getRepository, Repository, In } from 'typeorm';
import IValidacoesRepository from './interfaces/IValidacoesRepository';
import Validacao from '../entities/Validacao';

interface IResponseFindValidacoes {
  total: number;
  totalPage: number;
  items: object[];
}

class ValidacoesRepository implements IValidacoesRepository {
  private ormRepository: Repository<Validacao>;

  constructor() {
    this.ormRepository = getRepository(Validacao);
  }

  public async findValidacaoAtualByCpf(
    cpf: string,
  ): Promise<Validacao | undefined> {
    const validacoes = await this.ormRepository.findOne({
      where: {
        cpf,
        status: '2',
      },
    });

    return validacoes;
  }

  public async findValidacaoAtualByPesCodigo(
    pes_codigo: string,
  ): Promise<Validacao | undefined> {
    const validacoes = await this.ormRepository.findOne({
      where: {
        pes_codigo,
        status: '2',
      },
    });

    return validacoes;
  }

  public async findValidacoesByCpfs(
    cpfs: string[],
    page: number,
    perPage: number,
    sortfields?: string | undefined,
    sorts?: string | undefined,
  ): Promise<IResponseFindValidacoes | undefined> {
    const fieldsSortValid = ['atualizado_em', 'email', 'status'];
    let fields: string[];
    let sortsList: string[];
    const orders: { [key: string]: string } = {};
    if (sortfields && sorts) {
      fields = sortfields.split(',');
      sortsList = sorts.split(',');

      fields.map((field, index) => {
        if (fieldsSortValid.includes(field)) {
          orders[field] = sortsList[index];
        }
      });
    }

    const [validacoes, total] = await this.ormRepository.findAndCount({
      skip: page * perPage - perPage,
      take: perPage,
      where: {
        cpf: In(cpfs),
        status: In(['1', '2']),
      },
      order: orders,
      // relations: ['pessoa'],
    });

    return {
      total,
      totalPage: Math.ceil(total / Number(perPage)),
      items: validacoes,
    };
  }

  public async findValidacaoAnteriorByCpf(
    cpf: string,
  ): Promise<Validacao | undefined> {
    const validacoes = await this.ormRepository.findOne({
      where: {
        cpf,
        status: '2',
      },
    });

    return validacoes;
  }

  public async findById(id: number): Promise<Validacao | undefined> {
    const validacao = await this.ormRepository.findOne(id);

    return validacao;
  }

  public async findValidacoesAtivasOuPendentesByCpfs(
    cpfs: string[],
  ): Promise<Validacao[] | undefined> {
    const validacoes = await this.ormRepository.find({
      where: {
        cpf: In(cpfs),
        status: In(['1', '2']),
      },
    });

    return validacoes;
  }

  public async countValidacoesAtivasByCpfs(
    cpfs: string[],
  ): Promise<number | undefined> {
    const validacoes = await this.ormRepository.count({
      where: {
        cpf: In(cpfs),
        status: '2',
      },
    });

    return validacoes;
  }

  public async findAllByStatus(
    query: string,
  ): Promise<Validacao[] | undefined> {
    const validacao = await this.ormRepository.find({
      where: {
        status: query,
      },
    });

    return validacao;
  }

  public async findPendente(id: number): Promise<Validacao | undefined> {
    const validacao = await this.ormRepository.findOne({
      id_validacao: id,
      status: '1',
    });

    return validacao;
  }

  public async findPendenteByCpf(cpf: string): Promise<Validacao | undefined> {
    const validacao = await this.ormRepository.findOne({
      cpf,
      status: '1',
    });

    return validacao;
  }

  public async findPendenteOrAtualByCpf(
    cpf: string,
  ): Promise<Validacao[] | undefined> {
    const validacoes = await this.ormRepository.find({
      where: [
        {
          cpf,
          status: '1',
        },
        {
          cpf,
          status: '2',
        },
      ],
    });

    return validacoes;
  }

  public async create(validacaoDados: Validacao): Promise<Validacao> {
    const novaValidacao = this.ormRepository.create(validacaoDados);

    const validacao = this.ormRepository.save(novaValidacao);

    return validacao;
  }

  public async update(validacao: Validacao, newData: any): Promise<Validacao> {
    const validacaoUpdated = this.ormRepository.merge(validacao, newData);
    await this.ormRepository.save(validacaoUpdated);

    return validacaoUpdated;
  }
}

export default ValidacoesRepository;
