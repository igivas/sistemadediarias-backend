import {
  getRepository,
  Repository,
  FindOperator,
  MoreThanOrEqual,
  In,
} from 'typeorm';
import { format, subDays } from 'date-fns';
import IAssinaturasRepository from './interfaces/IAssinaturasRepository';
import Assinatura from '../entities/Assinatura';
import ICreateAssinaturaDTO from '../dtos/ICreateAssinaturaDTO';
import AssinaturaRevogada from '../entities/AssinaturaRevogada';

type updateDto = {
  [key: string]: string | number | Date;
};

const MoreThanDate = (date: Date): FindOperator<string> =>
  MoreThanOrEqual(format(date, 'yyyy-MM-dd HH:mm:ss'));

class AssinaturasRepository implements IAssinaturasRepository {
  private ormRepository: Repository<Assinatura>;

  private assinaturaRevogadaRepository: Repository<AssinaturaRevogada>;

  constructor() {
    this.ormRepository = getRepository(Assinatura);
    this.assinaturaRevogadaRepository = getRepository(AssinaturaRevogada);
  }

  public async create(
    assinaturaDados: ICreateAssinaturaDTO,
  ): Promise<Assinatura> {
    const novaAssinatura = this.ormRepository.create(assinaturaDados);

    const assinatura = this.ormRepository.save(novaAssinatura);

    return assinatura;
  }

  public async update(
    assinatura: Assinatura,
    newData: updateDto,
  ): Promise<Assinatura> {
    const newAssinatura = this.ormRepository.merge(assinatura, newData);

    const assinaturaUpdated = await this.ormRepository.save(newAssinatura);

    return assinaturaUpdated;
  }

  public async findAssinaturaAtivaByCpfs(
    cpfs: string[],
  ): Promise<number | undefined> {
    const assinatura = await this.ormRepository.count({
      cpf: In(cpfs),
      validade_assinatura: MoreThanDate(new Date()),
    });

    return assinatura;
  }

  public async findAssinaturaAtivaByCpf(
    cpf: string,
  ): Promise<Assinatura | undefined> {
    const assinatura = await this.ormRepository.findOne({
      cpf,
      validade_assinatura: MoreThanDate(new Date()),
    });

    return assinatura;
  }

  public async findAssinaturaAtivaByPesCodigo(
    pes_codigo: string,
  ): Promise<Assinatura | undefined> {
    const assinatura = await this.ormRepository.findOne({
      pes_codigo,
      validade_assinatura: MoreThanDate(new Date()),
    });

    return assinatura;
  }

  public async findAssinaturaByPesCodigo(
    pes_codigo: string,
  ): Promise<Assinatura | undefined> {
    const assinatura = await this.ormRepository.findOne({
      where: { pes_codigo },
      relations: ['pessoa'],
    });

    return assinatura;
  }

  public async findAssinaturaByCpf(
    cpf: string,
  ): Promise<Assinatura | undefined> {
    const assinatura = await this.ormRepository.findOne({
      where: { cpf },
      relations: ['pessoa'],
    });

    return assinatura;
  }

  public async findAssinaturasUtimos365diasByCpf(
    cpf: string,
  ): Promise<Assinatura[] | undefined> {
    const assinaturas = [] as Assinatura[];
    const assinatura = await this.ormRepository.findOne({
      where: {
        cpf,
      },
    });

    const assinaturasRevogadas = await this.assinaturaRevogadaRepository.find({
      where: {
        cpf,
        validade_assinatura: MoreThanDate(subDays(new Date(), 365)),
      },
    });

    if (assinatura) {
      assinaturas.push(assinatura);
    }

    assinaturasRevogadas.forEach(
      ({ id_assinatura_revogada, revogado_em, ...rest }) => {
        assinaturas.push({
          id_assinatura: id_assinatura_revogada,
          criado_em: revogado_em,
          atualizado_em: revogado_em,
          ...rest,
        });
      },
    );

    return assinaturas;
  }

  public async removeAssinaturas(ids: number[]): Promise<void> {
    this.ormRepository
      .createQueryBuilder()
      .delete()
      .from(Assinatura)
      .where('assinaturas.id_assinatura IN (:...ids)', { ids });
  }
}

export default AssinaturasRepository;
