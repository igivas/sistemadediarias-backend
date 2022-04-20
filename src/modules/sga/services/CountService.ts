import { injectable, inject } from 'tsyringe';

import IVPoliciaisValidacoesAssinaturasRepository from '../repositories/interfaces/IVPoliciaisValidacoesAssinaturasRepository';

interface IResponse {
  total: number | [];
  validacoes: number | [];
  assinaturas: number | [];
}

@injectable()
class CountService {
  constructor(
    @inject('VPoliciaisValidacoesAssinaturasRepository')
    private policiaisValidacoesRepository: IVPoliciaisValidacoesAssinaturasRepository,
  ) {}

  async execute(opm: number, subunidades: string): Promise<IResponse> {
    const counts = await this.policiaisValidacoesRepository.countAssinaturasValidacoes(
      opm,
      subunidades,
    );

    return counts;
  }
}

export default CountService;
