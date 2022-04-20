import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Transporte from '../entities/Transporte';
import ITransportesRepository from '../repositories/interfaces/ITransportesRepository';

interface IRequestTransporte {
  id_tran: number;
  descricao_tran: string;
  situacao_tran: string;
  usuario_alteracao: string;
}

@injectable()
class DeleteTransporteService {
  constructor(
    @inject('TransportesRepository')
    private transporteRepository: ITransportesRepository,
  ) {}

  public async execute(data: IRequestTransporte): Promise<Transporte> {
    const transporte = await this.transporteRepository.findById(data.id_tran);

    if (!transporte) {
      throw new AppError('Transporte não existe!', 404);
    }

    const transporteUpdate = await this.transporteRepository.softDelete(
      transporte,
      { ...data },
    );

    return transporteUpdate;
  }
}

export default DeleteTransporteService;
