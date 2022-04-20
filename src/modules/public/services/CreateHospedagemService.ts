import { inject, injectable } from 'tsyringe';
import AppError from '../../../errors/AppError';
import Hospedagem from '../entities/Hospedagem';
import IHospedagensRepository from '../repositories/interfaces/IHospedagensRepository';

interface IRequestHospedagem {
  descricao_hosp: string;
  situacao_hosp: string;
  id_usuario: string;
}

@injectable()
class CreateHospedagemService {
  constructor(
    @inject('HospedagensRepository')
    private hospedagemRepository: IHospedagensRepository,
  ) {}

  public async execute(data: IRequestHospedagem): Promise<Hospedagem> {
    const hospedagemExists = await this.hospedagemRepository.findByNome(
      data.descricao_hosp,
    );
    if (hospedagemExists) {
      throw new AppError('Este tipo de hospedagem já existe!');
    }

    const hospedagem = await this.hospedagemRepository.create({
      ...data,
      usuario_cadastro: data.id_usuario,
    });

    return hospedagem;
  }
}

export default CreateHospedagemService;
