type Perfil = {
  id_perfil: number;
  id_sistema: number;
  descricao: string;
  limite: number;
  sigla: string;
};
declare namespace Express {
  //  eslint-disable-next-line
  export interface Request {
    user: {
      id_usuario: string;
      opm: string;
      perfis: Perfil[];
    };
  }
}
