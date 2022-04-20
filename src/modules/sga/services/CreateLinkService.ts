import { injectable, inject } from 'tsyringe';
import { addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { getConnection } from 'typeorm';
import AppError from '../../../errors/AppError';
import ILinksRepository from '../repositories/interfaces/ILinksRepository';
import IValidacoesRepository from '../repositories/interfaces/IValidacoesRepository';
import Queue from '../../../lib/Queue';
import Link from '../entities/Link';

/**
 * Service de criação do link para geração da assinatura eletrônica pelo usuário.
 * Recebe o id_validacao.
 * - Verifica se existe validação para o id informado.
 * - Se existir validação verifica se o mesmo possui status 2 (Ativa)
 * - Se existir validação, estiver ativa e ainda estiver dentro da validade,
 *   retorna o mesmo token.
 * - Se existir validação, estiver ativa e naõ estivar dentro do prazo de validade,
 *   gera um novo link e move o anterior para links_utilizados.
 *
 */

interface IResponse {
  email: string;
  link: Link;
}

@injectable()
class CreateLinksService {
  constructor(
    @inject('LinksRepository')
    private linksRepository: ILinksRepository,

    @inject('ValidacoesRepository')
    private validacoesRepository: IValidacoesRepository,
  ) {}

  async execute(id_validacao: number, id_usuario: string): Promise<IResponse> {
    const validacaoAtual = await this.validacoesRepository.findById(
      id_validacao,
    );

    if (!validacaoAtual) {
      throw new AppError('Validação especificada não existe!');
    }

    if (validacaoAtual?.status !== '2') {
      throw new AppError('Não há email validado para este usuário!');
    }

    /**
     * @TODO:: Fazer aqui a verificação se o policial ainda
     * é autorizado possuir assinatura
     * exemplo: Policial ativo,
     *
     * */

    const linkAnterior = await this.linksRepository.findLinkByCpf(
      validacaoAtual.cpf,
    );

    const token = uuidv4();

    const validade = addDays(new Date(), 3);

    let link = {} as Link;

    const createLinkTransaction = async (): Promise<void> => {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (linkAnterior) {
          await queryRunner.manager.delete(Link, linkAnterior.id_link);
          link = queryRunner.manager.create(Link, {
            id_validacao,
            cpf: validacaoAtual.cpf,
            token,
            validade_token: validade,
            criado_por: id_usuario,
          });
          await queryRunner.manager.save(link);
        } else {
          link = queryRunner.manager.create(Link, {
            id_validacao,
            cpf: validacaoAtual.cpf,
            token,
            validade_token: validade,
            criado_por: id_usuario,
          });
          await queryRunner.manager.save(link);
        }

        await Queue.add('SendEmailLinkAssinatura', {
          email: validacaoAtual.email,
          token,
        });

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new AppError(`Ocorreu um erro ao tentar criar o link!`);
      } finally {
        await queryRunner.release();
      }
    };

    await createLinkTransaction();

    return { email: validacaoAtual.email, link };
  }
}

export default CreateLinksService;
