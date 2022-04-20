import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Hospedagem from '../entities/Hospedagem';
import IHospedagensRepository from '../repositories/interfaces/IHospedagensRepository';

interface IRequestHospedagem {
  id_hosp: number;
  descricao_hosp: string;
  situacao_hosp: string;
  usuario_alteracao: string;
}

@injectable()
class DeleteHospedagemService {
  constructor(
    @inject('HospedagensRepository')
    private hospedagemRepository: IHospedagensRepository,
  ) {}

  public async execute(data: IRequestHospedagem): Promise<Hospedagem> {
    const hospedagem = await this.hospedagemRepository.findById(data.id_hosp);

    if (!hospedagem) {
      throw new AppError('Hospedagem não existe!', 404);
    }

    const hospedagemUpdate = await this.hospedagemRepository.softDelete(
      hospedagem,
      { ...data },
    );

    return hospedagemUpdate;
  }
}

export default DeleteHospedagemService;
