export default interface ICreateDocumentoDTO {
  id_sistema: number;
  id_tipo_documento: number;
  tipo_documento: string;
  id_documento_origem: number;
  numero_documento: string;
  hash_sha1: string;
  hash_md5: string;
  verificador: string;
  path: string;
  ext: string;
  cpfs_interessados: string;
  opm_interessado: number;
}
