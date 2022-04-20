import { getRepository, Repository } from 'typeorm';
import IPessoasEnderecosRepository from './interfaces/IPessoasEnderecosRepository';
import PessoaEndereco from '../entities/PessoaEndereco';
import IUpdateEnderecoDTO from '../dtos/IUpdateEnderecoDTO';
import ICreateEnderecoDTO from '../dtos/ICreateEnderecoDTO';

class PessoasEnderecosRepository implements IPessoasEnderecosRepository {
  private pessoaEnderecoRepository: Repository<PessoaEndereco>;

  constructor() {
    this.pessoaEnderecoRepository = getRepository(PessoaEndereco);
  }

  public async update(
    endereco: PessoaEndereco,
    newData: IUpdateEnderecoDTO,
  ): Promise<PessoaEndereco> {
    const enderecoUpdated = this.pessoaEnderecoRepository.merge(endereco, {
      data_alteracao: new Date(),
      ...newData,
    });

    await this.pessoaEnderecoRepository.save(enderecoUpdated);

    return enderecoUpdated;
  }

  public async create(endereco: ICreateEnderecoDTO): Promise<PessoaEndereco> {
    const enderecoCreate = this.pessoaEnderecoRepository.create({
      ...endereco,
      data_cadastro: new Date(),
      pes_pais: 'BR',
      pes_situacao_endereco: '01',
    });

    await this.pessoaEnderecoRepository.save(enderecoCreate);

    return enderecoCreate;
  }

  public async findById(id: number): Promise<PessoaEndereco | undefined> {
    const endereco = await this.pessoaEnderecoRepository.findOne(id);

    return endereco;
  }

  public async findByPesCodigo(pes_codigo: string): Promise<PessoaEndereco[]> {
    const enderecos = await this.pessoaEnderecoRepository.find({
      where: {
        pes_codigo,
        pes_situacao_endereco: '01',
      },
    });

    return enderecos;
  }
}

export default PessoasEnderecosRepository;
