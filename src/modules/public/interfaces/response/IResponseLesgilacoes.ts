import Legislacao from '@modules/public/entities/Legislacao';

export type IResponseLegislacoes = {
  items: Legislacao[];
  total: number;
  totalPage: number;
};
