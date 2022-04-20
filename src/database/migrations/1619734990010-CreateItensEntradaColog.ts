import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateItensEntradaColog1619734990010
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'itens_entrada_colog',
        columns: [
          {
            name: 'id_item_entrada',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          { name: 'id_item', type: 'integer' },
          { name: 'id_entrada_colog', type: 'integer' },
          { name: 'lote', type: 'varchar' },
          { name: 'quantidade', type: 'integer' },
        ],
        foreignKeys: [
          {
            name: `FK_ITEM_ENTRADA_COLOG_ITENS`,
            referencedTableName: 'itens',
            referencedColumnNames: ['id_item'],
            columnNames: ['id_item'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            name: `FK_ITENS_ENTRADA_COLOG_ITENS_ENTRADA`,
            referencedTableName: 'entrada_colog',
            referencedColumnNames: ['id_entrada_colog'],
            columnNames: ['id_entrada_colog'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('itens_entrada_colog');
  }
}
