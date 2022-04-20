import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
import VListaOpms from '../entities/VListaOpms';
import IVListaOpmsRepository from '../repositories/interfaces/IVListaOpmsRepository';

@injectable()
class ListOpmsService {
  constructor(
    @inject('VListaOpmsRepository')
    private vListaOpmsRepository: IVListaOpmsRepository,
  ) {}

  public async execute(usuario: string): Promise<{ items: VListaOpms[] }> {
    const items = await this.vListaOpmsRepository.findOpm(usuario);

    if (!items) {
      throw new AppError('Nenhum registro encontrado!', 404);
    }

    return { items };
  }
}

export default ListOpmsService;
