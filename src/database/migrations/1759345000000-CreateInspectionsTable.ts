import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInspectionsTable1759345000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'inspections',
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
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'property_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'agent_id',
            type: 'int',
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'preferred_date_time',
            type: 'timestamp',
          },
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'payment_reference',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
          },
          {
            name: 'scheduled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'confirmed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancellation_reason',
            type: 'text',
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

    // Create foreign keys
    await queryRunner.createForeignKey(
      'inspections',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_inspection_user',
      }),
    );

    await queryRunner.createForeignKey(
      'inspections',
      new TableForeignKey({
        columnNames: ['property_id'],
        referencedTableName: 'properties',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_inspection_property',
      }),
    );

    await queryRunner.createForeignKey(
      'inspections',
      new TableForeignKey({
        columnNames: ['agent_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_inspection_agent',
      }),
    );

    // Create indexes
    await queryRunner.createIndex(
      'inspections',
      new TableIndex({
        name: 'idx_inspection_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'inspections',
      new TableIndex({
        name: 'idx_inspection_user',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'inspections',
      new TableIndex({
        name: 'idx_inspection_agent',
        columnNames: ['agent_id'],
      }),
    );

    await queryRunner.createIndex(
      'inspections',
      new TableIndex({
        name: 'idx_inspection_property',
        columnNames: ['property_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('inspections', 'fk_inspection_agent');
    await queryRunner.dropForeignKey('inspections', 'fk_inspection_property');
    await queryRunner.dropForeignKey('inspections', 'fk_inspection_user');
    await queryRunner.dropTable('inspections');
  }
}
