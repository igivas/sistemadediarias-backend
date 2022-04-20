export type IGetLegislacoes = {
  page?: number;
  perPage?: number;
  query?: string;
  fields?: string[];

  fieldSort?: string[];
  orderSort?: string[];
};
