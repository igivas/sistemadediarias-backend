import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import VListaPostoClasseCargo from '../entities/VListaPostoClasseCargo';

import IVListaPostoClasseCargoRepository from '../repositories/interfaces/IVListaPostoClasseCargoRepository';

@injectable()
class ListPostoClasseCargoService {
  constructor(
    @inject('VListaPostoClasseCargoRepository')
    private vListaPostoClasseCargoRepository: IVListaPostoClasseCargoRepository,
  ) {}

  public async execute(
    tipific_cargo: string,
  ): Promise<{ items: VListaPostoClasseCargo[] }> {
    const items = await this.vListaPostoClasseCargoRepository.findCargo(
      tipific_cargo,
    );

    if (!items) {
      throw new AppError('Nenhum registro cadastrado!', 404);
    }

    return { items };
  }
}

export default ListPostoClasseCargoService;
