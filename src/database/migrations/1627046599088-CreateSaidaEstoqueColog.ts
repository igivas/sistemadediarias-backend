import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateSaidaEstoqueColog1627046599088
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'saida_colog',
        columns: [
          {
            name: 'id_saida_colog',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },
          { name: 'id_documento_sga', type: 'integer', isNullable: true },
          { name: 'opm', type: 'integer' },
          { name: 'cod_pm', type: 'varchar', isNullable: true },
          { name: 'pgopmpm', type: 'varchar' },
          { name: 'data_saida', type: 'timestamp', default: 'now()' },
          { name: 'despachado_por', type: 'varchar' },
          { name: 'recebido_por', type: 'varchar', isNullable: true },
          { name: 'status', type: 'varchar' },
          { name: 'path_documento', type: 'varchar', isNullable: true },
          { name: 'criado_por', type: 'varchar' },
          { name: 'criado_em', type: 'timestamp', default: 'now()' },
          { name: 'atualizado_por', type: 'varchar' },
          { name: 'atualizado_em', type: 'timestamp' },
        ],
        foreignKeys: [
          {
            name: `FK_SAIDA_COLOG_DOCUMENTO`,
            referencedTableName: 'sga.documentos',
            referencedColumnNames: ['id_documento'],
            columnNames: ['id_documento_sga'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            name: `FK_OPM_COLOG_UNIDADE`,
            referencedTableName: 'public.unidade',
            referencedColumnNames: ['uni_codigo'],
            columnNames: ['opm'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            name: `FK_PM_COLOG_PESSOA_PM`,
            referencedTableName: 'public.pessoa_pm',
            referencedColumnNames: ['pm_codigo'],
            columnNames: ['cod_pm'],
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('saida_colog');
  }
}
