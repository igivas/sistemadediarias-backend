import { injectable, inject } from 'tsyringe';
import IUsuariosUnidadesRepository from '@modules/public/repositories/interfaces/IUsuariosUnidadesRepository';
import IPoliciaisECivisRepository from '../repositories/interfaces/IPoliciaisECivisRepository';
import VPolicialECivil from '../entities/VPolicialECivil';

@injectable()
class ListPoliciaisECivisService {
  constructor(
    @inject('PoliciaisECivisRepository')
    private pessoasRepository: IPoliciaisECivisRepository,

    @inject('UsuariosUnidadesRepository')
    private unidadesUsuariosRepository: IUsuariosUnidadesRepository,
  ) {}

  public async execute(
    query: string | undefined,
    id_usuario: string,
    opm: number,
  ): Promise<VPolicialECivil[] | undefined> {
    const pessoas = await this.pessoasRepository.findByQuery(query, [opm]);

    return pessoas;
  }
}

export default ListPoliciaisECivisService;
