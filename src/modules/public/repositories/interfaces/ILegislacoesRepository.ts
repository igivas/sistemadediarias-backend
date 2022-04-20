import IDeleteLegislacaoDTO from '@modules/public/dtos/IDeleteLegislacaoDTO';
import IUpdateLegislacaoDTO from '@modules/public/dtos/IUpdateLegislacaoDTO';
import ICreateLegislacaoDTO from '../../dtos/ICreateLegislacaoDTO';
import Legislacao from '../../entities/Legislacao';

export default interface ILegislacoesRepository {
  create(data: ICreateLegislacaoDTO): Promise<Legislacao>;

  listLegislacao(
    page: number,
    perPage: number,
    query?: string,
  ): Promise<{ legislacoes: Legislacao[]; total: number }>;
  update(
    legislacao: Legislacao,
    newData: IUpdateLegislacaoDTO,
  ): Promise<Legislacao>;

  findById(id: number): Promise<Legislacao | undefined>;

  findByNome(decreto_leg: string): Promise<Legislacao | undefined>;

  softDelete(
    legislacao: Legislacao,
    newData: IDeleteLegislacaoDTO,
  ): Promise<Legislacao>;
}
