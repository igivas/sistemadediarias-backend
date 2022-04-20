import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Transporte from '../entities/Transporte';
import ITransportesRepository from '../repositories/interfaces/ITransportesRepository';

interface IRequestTransporte {
  descricao_tran: string;
  situacao_tran: string;
  id_usuario: string;
}

@injectable()
class CreateTransporteService {
  constructor(
    @inject('TransportesRepository')
    private transporteRepository: ITransportesRepository,
  ) {}

  public async execute(data: IRequestTransporte): Promise<Transporte> {
    const transporteExists = await this.transporteRepository.findByNome(
      data.descricao_tran,
    );
    if (transporteExists) {
      throw new AppError('Este tipo de transporte já existe!');
    }

    const transporte = await this.transporteRepository.create({
      ...data,
      usuario_cadastro: data.id_usuario,
    });

    return transporte;
  }
}

export default CreateTransporteService;
