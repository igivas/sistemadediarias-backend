import Assinatura from '../../entities/Assinatura';
import ICreateAssinaturaDTO from '../../dtos/ICreateAssinaturaDTO';

export default interface IAssinaturasRepository {
  findAssinaturaAtivaByCpf(cpf: string): Promise<Assinatura | undefined>;
  findAssinaturaAtivaByPesCodigo(
    pes_codigo: string,
  ): Promise<Assinatura | undefined>;
  findAssinaturaAtivaByCpfs(cpfs: string[]): Promise<number | undefined>;
  findAssinaturasUtimos365diasByCpf(
    cpf: string,
  ): Promise<Assinatura[] | undefined>;

  findAssinaturaByCpf(cpf: string): Promise<Assinatura | undefined>;
  findAssinaturaByPesCodigo(
    pes_codigo: string,
  ): Promise<Assinatura | undefined>;
  create(assinatura: ICreateAssinaturaDTO): Promise<Assinatura>;
  update(
    assinatura: Assinatura,
    newData: { [key: string]: string | number | Date },
  ): Promise<Assinatura>;
}
