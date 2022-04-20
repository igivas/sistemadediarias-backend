import { sign } from 'jsonwebtoken';
import Usuario from '@modules/seg/entities/Usuario';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import IGraduacoesRepository from '@modules/seg/repositories/interfaces/IGraduacoesRepository';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import IGruposUsuarioRepository from '@modules/seg/repositories/interfaces/IGruposUsuarioRespository';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
import IUsuariosUnidadesRepository from '@modules/public/repositories/interfaces/IUsuariosUnidadesRepository';
import AppError from '../../../errors/AppError';
import IHashProvider from '../providers/HashProvider/IHashProvider';

interface IRequest {
  matricula: string;
  senha: string;
}

interface IUsuario extends Usuario {
  id_usuario: string;
  nome: string;
  pm_apelido?: string;
  cpf?: string;
  pm_codigo?: string;
  pm_numero?: string;
  matricula?: string;
  militar?: boolean;
  gra_codigo?: number;
  graduacao?: { gra_nome: string; gra_sigla: string };
  perfis?: any;
  opm?: any;
  opms?: any;
}

interface IResponse {
  usuario: Omit<IUsuario, 'usu_senha'>;
  token: string;
}

@injectable()
class AuthenticateUsuarioService {
  constructor(
    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('UsuariosUnidadesRepository')
    private usuariosUnidadesRepository: IUsuariosUnidadesRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasFisicasPmsRepository: IPessoasFisicasPmsRepository,

    @inject('GraduacoesRepository')
    private graduacoesRepository: IGraduacoesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('GruposUsuarioRepository')
    private gruposUsuarioRepository: IGruposUsuarioRepository,
  ) {}

  public async execute({ matricula, senha }: IRequest): Promise<IResponse> {
    const matriculaSanatized = matricula.replace(/[.-]/g, '').trim();
    const senhaSanatized = senha.trim();
    const usuario = await this.usuariosRepository.findByMatricula(
      matriculaSanatized,
    );

    if (!usuario) {
      throw new AppError('Combinação incorreta de matrícula e senha.', 401);
    }

    const senhaMatched = await this.hashProvider.compareHash(
      senhaSanatized,
      usuario.usu_senha,
    );

    console.log(senhaMatched);
    if (!senhaMatched) {
      throw new AppError('Combinação incorreta de matrícula e senha.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const pessoaFisicaPm = await this.pessoasFisicasPmsRepository.findByMatricula(
      matricula,
    );

    let usuarioObject: IUsuario;

    if (pessoaFisicaPm) {
      const graduacao = await this.graduacoesRepository.findById(
        pessoaFisicaPm.gra_codigo,
      );

      const opm = await this.unidadesRepository.findById(
        pessoaFisicaPm.uni_codigo,
      );

      // const subunidades = await this.unidadesRepository.findSubunidades(
      //   pessoaFisicaPm.uni_codigo,
      // );

      // const usuarioUnidades = await this.usuariosUnidadesRepository.findUnidadesByPesCodigo(
      //   usuario.usu_codigo,
      // );

      // const idsUnidades = usuarioUnidades
      //   ? usuarioUnidades.map(uni => uni.uni_codigo)
      //   : [];

      // const idsSubunidades = subunidades
      //   ? subunidades.map(sub => sub.uni_codigo)
      //   : [];

      // const todosIdsOpms = [...idsSubunidades, pessoaFisicaPm.uni_codigo];

      // const opms = await this.unidadesRepository.findByIds(todosIdsOpms);

      usuarioObject = {
        id_usuario: usuario.usu_codigo,
        militar: true,
        cpf: pessoaFisicaPm.pm_cpf,
        matricula: pessoaFisicaPm.pm_codigo,
        nome: usuario.usu_nome,
        ...pessoaFisicaPm,
        ...usuario,
        graduacao,
        opm,
        // opms,
      };
    } else {
      usuarioObject = {
        id_usuario: usuario.usu_codigo,
        nome: usuario.usu_nome,
        ...usuario,
      };
    }
    const grupos = await this.gruposUsuarioRepository.findByMatriculaSistema(
      matricula,
      [Number(process.env.ID_SISTEMA), 29],
    );

    if (!grupos || grupos.length <= 0) {
      throw new AppError(
        'Usuário não tem permissão pra acessar este sistema!',
        401,
      );
    }
    const perfis = grupos.map(grupo => {
      return {
        descricao: grupo.gru_nome,
        sigla: grupo.gru_codigo,
      };
    });

    if (grupos) {
      usuarioObject.perfis = perfis;
    }

    const token = sign({}, secret, {
      subject: JSON.stringify({
        id_usuario: String(pessoaFisicaPm?.pm_codigo),
        opm: String(pessoaFisicaPm?.uni_codigo),
        perfis,
      }),
      expiresIn,
    });

    // eslint-disable-next-line
    const { usu_senha, ...rest } = usuarioObject;
    delete usuarioObject.gra_codigo;

    return { usuario: { ...rest }, token };
  }
}

export default AuthenticateUsuarioService;
