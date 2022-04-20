import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateFornecedores1619707308466
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'fornecedores',
        columns: [
          {
            name: 'id_fornecedor',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },

          { name: 'nome', type: 'varchar' },
          { name: 'endereco', type: 'varchar' },
          { name: 'telefone', type: 'varchar' },
          { name: 'cnpj', type: 'varchar' },
          { name: 'criado_por', type: 'varchar' },
          { name: 'criado_em', type: 'timestamp', default: 'now()' },
          { name: 'atualizado_por', type: 'varchar', isNullable: true },
          { name: 'atualizado_em', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('fornecedores');
  }
}
