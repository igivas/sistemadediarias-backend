import { getRepository, IsNull, Not, Raw, Repository } from 'typeorm';
import IVPoliciaisValidacoesAssinaturasRepository from './interfaces/IVPoliciaisValidacoesAssinaturasRepository';
import VPolicialValidacaoAssinatura from '../entities/VPolicialValidacaoAssinatura';

interface IResponseFindPoliciais {
  total: number;
  totalPage: number;
  items: VPolicialValidacaoAssinatura[];
}

class PessoasFisicasPmsRepository
  implements IVPoliciaisValidacoesAssinaturasRepository {
  private ormRepository: Repository<VPolicialValidacaoAssinatura>;

  constructor() {
    this.ormRepository = getRepository(VPolicialValidacaoAssinatura);
  }

  public async countAssinaturasValidacoes(
    opm: number,
    subunidades: string,
  ): Promise<{ total: number; assinaturas: number; validacoes: number }> {
    let whereAssinaturas = [];
    if (subunidades === '1') {
      whereAssinaturas = [
        {
          assinatura: 'POSSUI',
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
        },
        {
          assinatura: 'POSSUI',
          uni_superior: opm === -1 ? Not(IsNull()) : opm,
        },
        {
          assinatura: 'POSSUI',
          uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
        },
      ];
    } else {
      whereAssinaturas = [
        {
          assinatura: 'POSSUI',
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
        },
      ];
    }

    let whereValidacoes = [];
    if (subunidades === '1') {
      whereValidacoes = [
        {
          validacao: 'VALIDADO',
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
        },
        {
          validacao: 'VALIDADO',
          uni_superior: opm === -1 ? Not(IsNull()) : opm,
        },
        {
          validacao: 'VALIDADO',
          uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
        },
      ];
    } else {
      whereValidacoes = [
        {
          validacao: 'VALIDADO',
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
        },
      ];
    }

    let whereTotal = [];
    if (subunidades === '1') {
      whereTotal = [
        {
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
        },
        {
          uni_superior: opm === -1 ? Not(IsNull()) : opm,
        },
        {
          uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
        },
      ];
    } else {
      whereTotal = [
        {
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
        },
      ];
    }

    const assinaturas = await this.ormRepository.count({
      where: whereAssinaturas,
    });

    const validacoes = await this.ormRepository.count({
      where: whereValidacoes,
    });

    const total = await this.ormRepository.count({
      where: whereTotal,
    });

    return {
      total,
      assinaturas: assinaturas || 0,
      validacoes: validacoes || 0,
    };
  }

  public async findByOpm(
    opm: number,
    page?: number | undefined,
    perPage?: number | undefined,
    sortfields?: string | undefined,
    sorts?: string | undefined,
    query?: string | undefined,
    subunidades?: string,
    valid?: string | undefined,
    assin?: string | undefined,
  ): Promise<IResponseFindPoliciais | undefined> {
    let customWhere = [];

    if (query) {
      if (subunidades === '0') {
        customWhere = [
          {
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
            uni_codigo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
            uni_codigo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
            uni_codigo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
        ];
      } else {
        customWhere = [
          {
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
            uni_codigo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
            uni_superior: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
            uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
            uni_codigo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
            uni_superior: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
            uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
            uni_codigo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
            uni_superior: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
          {
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
            uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
            assinatura: assin || Not(IsNull()),
            validacao: valid || Not(IsNull()),
          },
        ];
      }
    } else if (subunidades === '0') {
      customWhere = [
        {
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
          assinatura: assin || Not(IsNull()),
          validacao: valid || Not(IsNull()),
        },
      ];
    } else {
      customWhere = [
        {
          uni_codigo: opm === -1 ? Not(IsNull()) : opm,
          assinatura: assin || Not(IsNull()),
          validacao: valid || Not(IsNull()),
        },
        {
          uni_superior: opm === -1 ? Not(IsNull()) : opm,
          assinatura: assin || Not(IsNull()),
          validacao: valid || Not(IsNull()),
        },
        {
          uni_grd_cmdo: opm === -1 ? Not(IsNull()) : opm,
          assinatura: assin || Not(IsNull()),
          validacao: valid || Not(IsNull()),
        },
      ];
    }

    const fieldsSortValid = [
      'pm_codigo',
      'pm_apelido',
      'gra_nome',
      'validacao',
    ];
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

    const findOptions: any =
      page && perPage
        ? {
            select: [
              'pm_codigo',
              'pm_apelido',
              'gra_nome',
              // 'uni_codigo',
              'validacao',
              'assinatura',
              'uni_sigla',
            ],
            where: customWhere,
            skip: page * perPage - perPage,
            take: perPage,
            order: { ...orders },
          }
        : {
            select: [
              'pm_codigo',
              'pes_nome',
              'pm_apelido',
              'gra_nome',
              // 'uni_codigo',
              'validacao',
              'assinatura',
              'uni_sigla',
            ],
            where: customWhere,
          };

    const [policiais, total] = await this.ormRepository.findAndCount({
      ...findOptions,
    });

    return {
      total,
      totalPage: Math.ceil(total / Number(perPage)),
      items: policiais,
    };
  }
}

export default PessoasFisicasPmsRepository;
