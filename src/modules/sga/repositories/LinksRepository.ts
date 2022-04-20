import {
  getRepository,
  Repository,
  MoreThanOrEqual,
  FindOperator,
  LessThan,
} from 'typeorm';
import { format } from 'date-fns';
import ILinksRepository from './interfaces/ILinksRepository';
import Link from '../entities/Link';
import Validacao from '../entities/Validacao';

export const MoreThanDate = (date: Date): FindOperator<string> =>
  MoreThanOrEqual(format(date, 'yyyy-MM-dd HH:mm:ss'));
export const LessThanDate = (date: Date): FindOperator<string> =>
  LessThan(format(date, 'yyyy-MM-dd HH:mm:ss'));
// export const LessThanDate = (date: Date) =>
//   LessThan(format(date, 'yyyy-MM-dd HH:mm:ss'));
// yyyy-MM-dd kk:mm:ss.SSS

class LinksRepository implements ILinksRepository {
  private ormRepository: Repository<Link>;

  constructor() {
    this.ormRepository = getRepository(Link);
  }

  public async findLinkValidoByToken(token: string): Promise<Link | undefined> {
    const link = await this.ormRepository.findOne({
      token,

      validade_token: MoreThanDate(new Date()),
    });

    return link;
  }

  public async findLinkValidoByValidacao(
    id_validacao: number,
  ): Promise<Link | undefined> {
    const link = await this.ormRepository.findOne({
      id_validacao,
      validade_token: MoreThanDate(new Date()),
    });

    return link;
  }

  public async findLinkByCpf(cpf: string): Promise<Link | undefined> {
    const link = await this.ormRepository.findOne({
      cpf,
    });

    return link;
  }

  public async findById(id: number): Promise<Link | undefined> {
    const link = await this.ormRepository.findOne(id);

    return link;
  }

  public async create(
    validacao: Validacao,
    token: string,
    validade_token: Date,
  ): Promise<Link> {
    const novoLink = this.ormRepository.create({
      id_validacao: validacao.id_validacao,
      token,
      validade_token,
    });

    const link = this.ormRepository.save(novoLink);

    return link;
  }
}

export default LinksRepository;
