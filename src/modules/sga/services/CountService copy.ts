import { injectable, inject } from 'tsyringe';

import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import AppError from '../../../errors/AppError';
import IAssinaturasRepository from '../repositories/interfaces/IAssinaturasRepository';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';

interface IResponse {
  total: number | [];
  emails: number | [];
  assinaturas: number | [];
}

@injectable()
class CountService {
  constructor(
    @inject('AssinaturasRepository')
    private assinaturasRepository: IAssinaturasRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasPmsRepository: IPessoasFisicasPmsRepository,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(id_usuario: string): Promise<IResponse> {
    const pessoapm = await this.pessoasPmsRepository.findByMatricula(
      id_usuario,
    );

    if (!pessoapm) {
      throw new AppError('Militar não encontrado');
    }

    const cpfs = await this.pessoasPmsRepository.findCpfsByOpm(
      pessoapm.uni_codigo,
    );

    const assinaturaAtiva = await this.assinaturasRepository.findAssinaturaAtivaByCpfs(
      cpfs || [],
    );

    const validacoesAtiva = await this.validacoesRepository.countValidacoesAtivasByCpfs(
      cpfs || [],
    );

    return {
      total: cpfs?.length || 0,
      assinaturas: assinaturaAtiva || 0,
      emails: validacoesAtiva || 0,
    };
  }
}

export default CountService;
