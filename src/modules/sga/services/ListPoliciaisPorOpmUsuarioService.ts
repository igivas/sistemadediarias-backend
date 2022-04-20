import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
// import IUsuariosUnidadesRepository from '@modules/public/repositories/interfaces/IUsuariosUnidadesRepository';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import { injectable, inject } from 'tsyringe';
import IVPoliciaisValidacoesAssinaturasRepository from '../repositories/interfaces/IVPoliciaisValidacoesAssinaturasRepository';

interface IResponseFindValidacoes {
  total: number;
  totalPage: number;
  items: any;
}

@injectable()
class ListPoliciaisPorOpmUsuarioService {
  constructor(
    @inject('VPoliciaisValidacoesAssinaturasRepository')
    private policiaisValidacoesRepository: IVPoliciaisValidacoesAssinaturasRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasPmsRepository: IPessoasFisicasPmsRepository,
  ) {}

  async execute(
    opm: number,
    page: number,
    perPage: number,
    sortfields?: string,
    sorts?: string,
    filter?: string,
    query?: string | undefined,
    subunidades?: string,
    validacao?: string | undefined,
    assinatura?: string | undefined,
  ): Promise<IResponseFindValidacoes | undefined> {
    const policiais = await this.policiaisValidacoesRepository.findByOpm(
      opm,
      page,
      perPage,
      sortfields,
      sorts,
      query,
      subunidades,
      validacao,
      assinatura,
    );

    return policiais;
  }
}

export default ListPoliciaisPorOpmUsuarioService;
