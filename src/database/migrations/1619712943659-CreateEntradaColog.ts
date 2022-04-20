import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateEntradaColog1619712943659
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'entrada_colog',
        columns: [
          {
            name: 'id_entrada_colog',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          { name: 'id_fornecedor', type: 'integer' },
          { name: 'nota_fiscal', type: 'varchar' },
          { name: 'data_pedido', type: 'timestamp', default: 'now()' },
          { name: 'data_entrada', type: 'timestamp', default: 'now()' },
          { name: 'cadastrado_por', type: 'varchar' },
        ],
        foreignKeys: [
          {
            name: `FK_ENTRADA_COLOG_FORNECEDORES`,
            referencedTableName: 'fornecedores',
            referencedColumnNames: ['id_fornecedor'],
            columnNames: ['id_fornecedor'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('entrada_colog');
  }
}
