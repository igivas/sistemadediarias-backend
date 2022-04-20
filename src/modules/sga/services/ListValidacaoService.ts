import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';

interface IResponseFindValidacoes {
  total: number;
  totalPage: number;
  items: object[];
}

@injectable()
class ListValidacoesService {
  constructor(
    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,

    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasPmsRepository: IPessoasFisicasPmsRepository,
  ) {}

  async execute(
    id_usuario: string,
    page: number,
    perPage: number,
    sortfields?: string,
    sorts?: string,
  ): Promise<IResponseFindValidacoes | undefined> {
    const usuario = await this.usuariosRepository.findById(id_usuario);

    if (!usuario) {
      throw new AppError('Usuário não encontrado na base de dados!');
    }

    const policial = await this.pessoasPmsRepository.findByPesCodigo(
      usuario.usu_codigo,
    );

    if (!policial) {
      throw new AppError('Policial não encontrado com o cpf informado!');
    }

    const cpfsPoliciais = await this.pessoasPmsRepository.findCpfsByOpm(
      policial.uni_codigo,
    );

    const validacoes = this.validacoesRepository.findValidacoesByCpfs(
      cpfsPoliciais || [],
      page,
      perPage,
      sortfields,
      sorts,
    );

    return validacoes;
  }
}

export default ListValidacoesService;
