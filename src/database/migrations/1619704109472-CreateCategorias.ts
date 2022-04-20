import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCategorias1619704109472
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categorias',
        columns: [
          {
            name: 'id_categoria',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },

          { name: 'nome', type: 'varchar' },
          { name: 'criado_por', type: 'varchar' },
          { name: 'criado_em', type: 'timestamp', default: 'now()' },
          { name: 'atualizado_por', type: 'varchar', isNullable: true },
          { name: 'atualizado_em', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categorias');
  }
}
