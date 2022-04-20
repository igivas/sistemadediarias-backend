export default interface ICreateAssinaturaDTO {
  id_link_utilizado: number;
  cpf: string;
  nome: string;
  hash_assinatura: string;
  validade_assinatura: Date;
}
