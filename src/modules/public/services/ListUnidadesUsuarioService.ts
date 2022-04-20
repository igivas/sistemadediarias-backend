import { injectable, inject } from 'tsyringe';
import IUnidadesRepository from '../repositories/interfaces/IUnidadesRepository';
import Unidade from '../entities/Unidade';
import IUsuariosUnidadesRepository from '../repositories/interfaces/IUsuariosUnidadesRepository';

@injectable()
class ListUnidadesUsuarioService {
  constructor(
    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('UsuariosUnidadesRepository')
    private unidadesUsuariosRepository: IUsuariosUnidadesRepository,
  ) {}

  public async execute(
    query: string | undefined,
    pes_codigo: string,
    opm_usuario: number,
  ): Promise<Unidade[] | undefined> {
    const ids = await this.unidadesUsuariosRepository.findIdsUnidadesByPesCodigo(
      pes_codigo,
      Number(process.env.ID_SISTEMA),
    );

    const unidades = await this.unidadesRepository.findUnidades(query, [
      ...ids,
      opm_usuario,
    ]);

    return unidades;
  }
}

export default ListUnidadesUsuarioService;
