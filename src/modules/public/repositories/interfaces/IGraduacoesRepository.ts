import Graduacao from '../../entities/Graduacao';

export default interface IGraduacoesRepository {
  findById(id: number): Promise<Graduacao | undefined>;
  List(): Promise<Graduacao[] | undefined>;
}
