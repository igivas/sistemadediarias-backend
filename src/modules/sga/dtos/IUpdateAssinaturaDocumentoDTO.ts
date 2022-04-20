export default interface IUpdateAssinaturaDocumentoDTO {
  tipo_assinatura: '0' | '1' | '2';
  hash_sha1: string;
  hash_md5: string;
}
