import Link from '../../entities/Link';
import Validacao from '../../entities/Validacao';

export default interface ILinksRepository {
  findById(id: number): Promise<Link | undefined>;
  findLinkValidoByToken(codigo: string): Promise<Link | undefined>;
  findLinkValidoByValidacao(id_validacao: number): Promise<Link | undefined>;
  findLinkByCpf(cpf: string): Promise<Link | undefined>;
  create(
    validacao: Validacao,
    codigo_link: string,
    validade_link: Date,
  ): Promise<Link>;
}
