import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePaymentTransactionsTable1759350000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_transactions',
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
            name: 'reference',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'payment_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'entity_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
            unsigned: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          {
            name: 'amount_kobo',
            type: 'int',
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            default: "'NGN'",
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'pending'",
          },
          {
            name: 'payment_provider',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'authorization_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'access_code',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'customer_email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'customer_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'customer_phone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'provider_response',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'paid_at',
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
      'payment_transactions',
      new TableIndex({
        name: 'IDX_payment_transactions_reference',
        columnNames: ['reference'],
      }),
    );

    await queryRunner.createIndex(
      'payment_transactions',
      new TableIndex({
        name: 'IDX_payment_transactions_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'payment_transactions',
      new TableIndex({
        name: 'IDX_payment_transactions_entity',
        columnNames: ['payment_type', 'entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'payment_transactions',
      new TableIndex({
        name: 'IDX_payment_transactions_user_id',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_transactions');
  }
}
