/* import { getRepository, Repository } from 'typeorm';
import IUsuariosUnidadesRepository from './interfaces/IUsuariosUnidadesRepository';
import UsuarioUnidade from '../entities/UsuarioUnidade';

class UsuariosUnidadesRepository implements IUsuariosUnidadesRepository {
  private ormRepository: Repository<UsuarioUnidade>;

  constructor() {
    this.ormRepository = getRepository(UsuarioUnidade);
  }

  public async findIdsUnidadesByPesCodigo(
    pes_codigo: string,
    sis_codigo: number,
  ): Promise<number[]> {
    const unidades = await this.ormRepository.find({
      where: {
        usu_codigo: pes_codigo,
        sis_codigo,
      },
    });

    const ids = unidades ? unidades.map(uni => uni.uni_codigo) : [];

    return ids;
  }
}

export default UsuariosUnidadesRepository;
 */

import { getRepository, In, Repository } from 'typeorm';

import UsuarioUnidade from '../entities/UsuarioUnidade';
import VOpmAtual from '../entities/VOpmAtual';
import IUsuariosUnidadesRepository from './interfaces/IUsuariosUnidadesRepository';

class UsuariosUnidadesRepository implements IUsuariosUnidadesRepository {
  private ormRepository: Repository<UsuarioUnidade>;

  private opmsAtuaisRepository: Repository<VOpmAtual>;

  constructor() {
    this.ormRepository = getRepository(UsuarioUnidade);
    this.opmsAtuaisRepository = getRepository(VOpmAtual);
  }

  public async findIdsUnidadesByPesCodigo(
    pes_codigo: string,
  ): Promise<number[]> {
    const unidadesAtuais = await this.opmsAtuaisRepository.find();
    const idsUnidadesAtuais = unidadesAtuais
      ? unidadesAtuais.map(uni => uni.uni_codigo)
      : [];
    const unidades = await this.ormRepository.find({
      where: {
        usu_codigo: pes_codigo,
        sis_codigo: process.env.ID_SISTEMA,
        uni_codigo: In([...idsUnidadesAtuais, -1]),
      },
    });

    const ids = unidades ? unidades.map(uni => uni.uni_codigo) : [];

    return ids;
  }
}

export default UsuariosUnidadesRepository;
