export default interface ICreateAssinaturaDocumentoDTO {
  id_documento: number;
  cpf: string;
  id_pf: number;
  tipo_assinatura: '0' | '1' | '2';
  hash_md5: string;
}
