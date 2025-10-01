import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePropertyFeesTable1759344920000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create property_fees table
    await queryRunner.createTable(
      new Table({
        name: 'property_fees',
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
          },
          {
            name: 'fee_category',
            type: 'varchar',
            length: '255',
            comment: 'e.g., "Additional Fees (One-time, upfront)"',
          },
          {
            name: 'fee_name',
            type: 'varchar',
            length: '255',
            comment: 'e.g., "Caution Deposit"',
          },
          {
            name: 'purpose',
            type: 'text',
            comment: 'e.g., "Security for Property Damages"',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 15,
            scale: 2,
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

    // Create foreign key for property_id
    await queryRunner.createForeignKey(
      'property_fees',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedTableName: 'properties',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_property_fee_property',
      }),
    );

    // Create index
    await queryRunner.createIndex(
      'property_fees',
      new TableIndex({
        name: 'idx_property_fee_property',
        columnNames: ['property_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.dropForeignKey('property_fees', 'fk_property_fee_property');

    // Drop table
    await queryRunner.dropTable('property_fees');
  }
}
