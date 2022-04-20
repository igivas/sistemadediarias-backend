import { getRepository, Repository } from 'typeorm';

import Usuario from '@modules/seg/entities/Usuario';
import IUsuariosRepository from './interfaces/IUsuariosRepository';

class UsuariosRepository implements IUsuariosRepository {
  private ormRepository: Repository<Usuario>;

  constructor() {
    this.ormRepository = getRepository(Usuario);
  }

  public async findById(id: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne(id);

    return usuario;
  }

  public async findByEmail(email: string): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne({ where: { email } });

    return usuario;
  }

  public async findByMatricula(
    matricula: string,
  ): Promise<Usuario | undefined> {
    const usuario = await this.ormRepository.findOne({
      select: ['usu_email', 'usu_nome', 'usu_senha', 'usu_codigo'],
      where: { usu_codigo: matricula },
    });

    return usuario;
  }
}

export default UsuariosRepository;
