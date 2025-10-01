import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAssetsTable1759321690000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create assets table
    await queryRunner.createTable(
      new Table({
        name: 'assets',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'property_id',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'product_id',
            type: 'bigint',
            unsigned: true,
            isNullable: true,
          },
          {
            name: 'path',
            type: 'varchar',
            length: '500',
            comment: 'S3 URL or file path',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            default: "'gallery'",
          },
          {
            name: 'order',
            type: 'int',
            default: 0,
            comment: 'Display order for sorting',
          },
          {
            name: 'alt_text',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'idx_asset_property',
        columnNames: ['property_id'],
      }),
    );

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'idx_asset_product',
        columnNames: ['product_id'],
      }),
    );

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'idx_asset_type',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'assets',
      new TableIndex({
        name: 'idx_asset_order',
        columnNames: ['order'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table
    await queryRunner.dropTable('assets');
  }
}
