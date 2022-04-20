import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateDocumentos1633441814788
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'documentos',
        columns: [
          {
            name: 'id_documento',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
          },

          { name: 'tipo_documento', type: 'integer' },
          { name: 'id_saida_colog', type: 'integer' },
          { name: 'id_documento_sga', type: 'integer' },
          { name: 'url_sga', type: 'integer' },
          { name: 'criado_por', type: 'varchar' },
          { name: 'criado_em', type: 'timestamp', default: 'now()' },
          { name: 'atualizado_por', type: 'varchar', isNullable: true },
          { name: 'atualizado_em', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('documentos');
  }
}
