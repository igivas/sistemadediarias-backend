import { injectable, inject } from 'tsyringe';
import AppError from '../../../errors/AppError';
import ILinksRepository from '../repositories/interfaces/ILinksRepository';
import Link from '../entities/Link';

@injectable()
class CreateLinksService {
  constructor(
    @inject('LinksRepository')
    private linksRepository: ILinksRepository,
  ) {}

  async execute(codigo: string): Promise<Link> {
    const link = await this.linksRepository.findLinkValidoByToken(codigo);

    if (!link) {
      throw new AppError('O link é inexistente ou não é mais válido');
    }
    return link;
  }
}

export default CreateLinksService;
