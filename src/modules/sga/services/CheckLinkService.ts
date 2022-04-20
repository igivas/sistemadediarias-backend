import { injectable, inject } from 'tsyringe';
import { validate } from 'uuid';

import AppError from '../../../errors/AppError';

import ILinksRepository from '../repositories/interfaces/ILinksRepository';

@injectable()
class CheckLinkService {
  constructor(
    @inject('LinksRepository')
    private linksRepository: ILinksRepository,
  ) {}

  async execute(token: string): Promise<void> {
    if (!validate(token)) {
      throw new AppError('Este link não é válido');
    }

    const link = await this.linksRepository.findLinkValidoByToken(token);

    if (!link) {
      throw new AppError('O link é inexistente ou não é mais válido');
    }
  }
}

export default CheckLinkService;
