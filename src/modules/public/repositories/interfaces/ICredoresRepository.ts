import IUpdateCredorDTO from '@modules/public/dtos/IUpdateCredorDTO';
import PessoaPm from '@modules/public/entities/PessoaPm';

export default interface ICredoresRepository {
  findByPm(matricula: string): Promise<PessoaPm | undefined>;

  update(credor: PessoaPm, newData: IUpdateCredorDTO): Promise<PessoaPm>;
}
