import { getRepository, IsNull, Not, Raw, Repository } from 'typeorm';
import IPessoaUniformeRepository from './interfaces/IPessoasUniformesRepository';
import PessoaUniforme from '../entities/PessoaUniforme';
import VDashboardColog from '../entities/VListaDashBoardColog';
import VListaFardamento from '../entities/VListaFardamento';
import IUpdateUniformeDTO from '../dtos/IUpdateUniformeDTO';
import VRelatorioQuantitativo from '../entities/VRelatorioQuantitativo';

class PessoasUniformesRepository implements IPessoaUniformeRepository {
  private pessoaUniformeRepository: Repository<PessoaUniforme>;

  private vDashboardColog: Repository<VDashboardColog>;

  private vListaFardamento: Repository<VListaFardamento>;

  private vRelatorioQuantitativo: Repository<VRelatorioQuantitativo>;

  constructor() {
    this.pessoaUniformeRepository = getRepository(PessoaUniforme);
    this.vDashboardColog = getRepository(VDashboardColog);
    this.vListaFardamento = getRepository(VListaFardamento);
    this.vRelatorioQuantitativo = getRepository(VRelatorioQuantitativo);
  }

  public async update(
    uniforme: PessoaUniforme,
    newData: IUpdateUniformeDTO,
  ): Promise<PessoaUniforme> {
    const uniformeUpdated = this.pessoaUniformeRepository.merge(uniforme, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.pessoaUniformeRepository.save(uniformeUpdated);

    return uniformeUpdated;
  }

  /* public async create(endereco: ICreateEnderecoDTO): Promise<PessoaEndereco> {
    const enderecoCreate = this.pessoaEnderecoRepository.create({
      ...endereco,
      data_cadastro: new Date(),
      pes_pais: 'BR',
      pes_situacao_endereco: '01',
    });

    await this.pessoaEnderecoRepository.save(enderecoCreate);

    return enderecoCreate;
  } */

  public async findById(id: number): Promise<PessoaUniforme | undefined> {
    const endereco = await this.pessoaUniformeRepository
      .createQueryBuilder('pessoa_uniforme')
      .leftJoinAndSelect('pessoa_uniforme.pessoaFisicaPm', 'pessoaFisicaPm')
      .select([
        'pessoa_uniforme.peu_cabeca as peu_cabeca',
        'pessoa_uniforme.peu_codigo as peu_codigo',
        'pessoa_uniforme.peu_calca as peu_calca',
        'pessoaFisicaPm.pm_apelido as pm_apelido',

        'pessoa_uniforme.peu_blusa_interna as peu_blusa_interna',
        'pessoa_uniforme.peu_gandola as peu_gandola',
        'pessoa_uniforme.peu_sapato as peu_sapato',
        'pessoa_uniforme.peu_coldre as peu_coldre',
        'pessoa_uniforme.peu_calca_sexo as peu_calca_sexo',
        'pessoa_uniforme.data_alteracao as data_alteracao',
        'pessoa_uniforme.peu_gandola_sexo as peu_gandola_sexo',
        'pessoa_uniforme.peu_combatshirt as peu_combatshirt',
        'pessoa_uniforme.peu_combatshirt_sexo as peu_combatshirt_sexo',

        'pessoaFisicaPm.gra_codigo as gra_codigo',
        'pessoaFisicaPm.pm_codigo as pm_codigo',
      ])
      .where(`pessoa_uniforme.peu_codigo=${id}`)
      .execute();

    return endereco;
  }

  /*  public async ListPendentes(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
  ): Promise<{ uniformes: any[]; total: number }> {
    let wherePersonalizado = [];
    if (subunidades === '1') {
      wherePersonalizado = [
        {
          editou: 'PENDENTE',
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
        },
        {
          editou: 'PENDENTE',
          uni_superior: opm === '-1' ? Not(IsNull()) : opm,
        },
        {
          editou: 'PENDENTE',
          uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          editou: 'PENDENTE',
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
        },
      ];
    }
    const [consulta, total] = await this.vListaFardamento.findAndCount({
      where: wherePersonalizado,
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { uniformes: consulta, total };
  } */

  public async ListPendentes(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
    query: string,
  ): Promise<{ uniformes: any[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      if (subunidades === '1') {
        wherePersonalizado = [
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
        ];
      } else {
        wherePersonalizado = [
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: 'PENDENTE',
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
        ];
      }
    } else if (subunidades === '1') {
      wherePersonalizado = [
        {
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
          editou: 'PENDENTE',
        },
        {
          uni_superior: opm === '-1' ? Not(IsNull()) : opm,
          editou: 'PENDENTE',
        },
        {
          uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
          editou: 'PENDENTE',
        },
      ];
    } else {
      wherePersonalizado = [
        {
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
          editou: 'PENDENTE',
        },
      ];
    }
    const [consulta, total] = await this.vListaFardamento.findAndCount({
      where: wherePersonalizado,
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { uniformes: consulta, total };
  }

  public async List(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
    editou: string,
    query: string,
  ): Promise<{ uniformes: any[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      if (subunidades === '1') {
        wherePersonalizado = [
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_sexo: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_sexo: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_sexo: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
        ];
      } else {
        wherePersonalizado = [
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_codigo: Raw(
              pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_sexo: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_numero: Raw(
              pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`,
            ),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            gra_nome: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            editou: editou || Not(IsNull()),
            pm_apelido: Raw(
              pm_apelido => `LOWER(${pm_apelido}) ILIKE '%${query}%'`,
            ),
          },
        ];
      }
    } else if (subunidades === '1') {
      wherePersonalizado = [
        {
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
          editou: editou || Not(IsNull()),
        },
        {
          uni_superior: opm === '-1' ? Not(IsNull()) : opm,
          editou: editou || Not(IsNull()),
        },
        {
          uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
          editou: editou || Not(IsNull()),
        },
      ];
    } else {
      wherePersonalizado = [
        {
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
          editou: editou || Not(IsNull()),
        },
      ];
    }
    const [consulta, total] = await this.vListaFardamento.findAndCount({
      where: wherePersonalizado,
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { uniformes: consulta, total };
  }

  public async ListRelatorioQuantitativo(
    opm: string,
    page: number,
    perPage: number,
    subunidades: string,
    query: string,
  ): Promise<{ dados: any[]; total: number }> {
    let wherePersonalizado = [];
    if (query) {
      if (subunidades === '1') {
        wherePersonalizado = [
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            peca: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            peca: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            peca: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            opm_nm: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            opm_nm: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            opm_nm: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            tamanho: Raw(pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`),
          },
          {
            uni_superior: opm === '-1' ? Not(IsNull()) : opm,
            tamanho: Raw(pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`),
          },
          {
            uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
            tamanho: Raw(pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`),
          },
        ];
      } else {
        wherePersonalizado = [
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            opm_nm: Raw(pm_codigo => `LOWER(${pm_codigo}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            peca: Raw(pm_numero => `LOWER(${pm_numero}) ILIKE '%${query}%'`),
          },
          {
            uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
            tamanho: Raw(gra_nome => `LOWER(${gra_nome}) ILIKE '%${query}%'`),
          },
        ];
      }
    } else if (subunidades === '1') {
      wherePersonalizado = [
        {
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
        },
        {
          uni_superior: opm === '-1' ? Not(IsNull()) : opm,
        },
        {
          uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          uni_codigo: opm === '-1' ? Not(IsNull()) : opm,
        },
      ];
    }
    const [consulta, total] = await this.vRelatorioQuantitativo.findAndCount({
      where: wherePersonalizado,
      skip: page * perPage - perPage,
      take: perPage,
    });

    return { dados: consulta, total };
  }

  public async ListDashboardDataOpm(
    opm: any,
    subunidades: any,
  ): Promise<any[]> {
    let wherePersonalizado = [];
    if (opm === -1) {
      wherePersonalizado = [];
      // console.log('pmce');
    } else if (subunidades === '0') {
      wherePersonalizado = [
        {
          codigoopm: opm === '-1' ? Not(IsNull()) : opm,
        },
      ];
    } else {
      wherePersonalizado = [
        {
          codigoopm: opm === '-1' ? Not(IsNull()) : opm,
        },
        {
          uni_superior: opm === '-1' ? Not(IsNull()) : opm,
        },
        {
          uni_grd_cmdo: opm === '-1' ? Not(IsNull()) : opm,
        },
      ];
    }
    const dadosDashboard = await this.vDashboardColog.find({
      where: wherePersonalizado,
    });

    return dadosDashboard;
  }

  public async ListDashboardDataColog(): Promise<any[]> {
    const dadosDashboard = await this.vDashboardColog.find();

    return dadosDashboard;
  }

  public async findByIdSemRel(id: number): Promise<PessoaUniforme | undefined> {
    const endereco = await this.pessoaUniformeRepository.findOne({
      where: { peu_codigo: id },
    });

    return endereco;
  }

  public async findByPesCodigo(pes_codigo: string): Promise<any> {
    const endereco = await this.vListaFardamento.findOne({
      where: {
        pm_codigo: pes_codigo,
      },
    });

    return endereco;
  }
  /*
  public async findByPesCodigo(
    pes_codigo: string,
    page?: number,
    perPage?: number,
  ): Promise<any[]> {
    const paginacao =
      page && perPage ? { take: perPage, skip: page * perPage - perPage } : {};
    const uniforme = await this.pessoaUniformeRepository.findAndCount({
      where: {
        pes_codigo,
        unf_codigo: 1,
        // pes_situacao_endereco: '01',
      },
      ...paginacao,
      // relations: ['pessoaFisicaPm'],
    });

    return uniforme;
  } */
}

export default PessoasUniformesRepository;
