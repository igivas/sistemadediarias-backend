import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateItens1619707388319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'itens',
        columns: [
          {
            name: 'id_item',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },

          { name: 'id_categoria', type: 'integer' },
          { name: 'nome', type: 'varchar' },
          { name: 'sexo', type: 'varchar', length: '1', isNullable: true },
          { name: 'tamanho', type: 'varchar', length: '4', isNullable: true },
          {
            name: 'lateralidade_corporal',
            type: 'varchar',
            length: '1',
            isNullable: true,
          },
          { name: 'tipo_batalhao', type: 'varchar', isNullable: true },
          { name: 'modalidade_coturno', type: 'varchar', isNullable: true },
          {
            name: 'descricao',
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
          { name: 'criado_por', type: 'varchar' },
          { name: 'criado_em', type: 'timestamp', default: 'now()' },
          { name: 'atualizado_por', type: 'varchar', isNullable: true },
          { name: 'atualizado_em', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            name: `FK_ITENS_CATEGORIAS`,
            referencedTableName: 'categorias',
            referencedColumnNames: ['id_categoria'],
            columnNames: ['id_categoria'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('itens');
  }
}
