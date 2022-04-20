import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import PessoaTelefone from '../entities/PessoaTelefone';

import IPessoasTelefonesRepository from '../repositories/interfaces/IPessoasTelefonesRepository';

interface IRequest {
  pes_codigo: string;
  pes_fone: string;
  pes_tipo_fone: string;
  id_usuario: string;
}

@injectable()
class CreateTelefonePolicialService {
  constructor(
    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasTelefonesRepository')
    private pessoaTelefoneRepository: IPessoasTelefonesRepository,
  ) {}

  public async execute(data: IRequest): Promise<PessoaTelefone> {
    const telefoneExists = await this.pessoaTelefoneRepository.findTelefoneByPf(
      data.pes_fone,
      data.pes_codigo,
      data.pes_tipo_fone,
    );

    if (telefoneExists) {
      throw new AppError('Este telefone já está cadastrado!');
    }

    const telefone = await this.pessoaTelefoneRepository.create({
      ...data,
      usuario_cadastro: data.id_usuario,
    });

    return telefone;
  }
}

export default CreateTelefonePolicialService;
