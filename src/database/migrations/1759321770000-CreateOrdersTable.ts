import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateOrdersTable1759321770000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'orders',
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
                        isNullable: true,
                    },
                    {
                        name: 'order_number',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                    },
                    {
                        name: 'total_amount',
                        type: 'decimal',
                        precision: 8,
                        scale: 2,
                        default: 0,
                    },
                    {
                        name: 'payment_method',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'payment_status',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '255',
                        default: "'pending'",
                    },
                    {
                        name: 'delivery_address',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'delivery_fee',
                        type: 'decimal',
                        precision: 8,
                        scale: 2,
                        isNullable: true,
                        default: 0,
                    },
                    {
                        name: 'payment_reference',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'tax',
                        type: 'decimal',
                        precision: 8,
                        scale: 2,
                        isNullable: true,
                        default: 0,
                    },
                    {
                        name: 'note',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'guest_id',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: null,
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

        // Create foreign key for user_id
        await queryRunner.createForeignKey(
            'orders',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create indexes
        await queryRunner.createIndex(
            'orders',
            new TableIndex({
                name: 'IDX_ORDER_USER',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createIndex(
            'orders',
            new TableIndex({
                name: 'IDX_ORDER_NUMBER',
                columnNames: ['order_number'],
            }),
        );

        await queryRunner.createIndex(
            'orders',
            new TableIndex({
                name: 'IDX_ORDER_STATUS',
                columnNames: ['status'],
            }),
        );

        await queryRunner.createIndex(
            'orders',
            new TableIndex({
                name: 'IDX_ORDER_PAYMENT_STATUS',
                columnNames: ['payment_status'],
            }),
        );

        await queryRunner.createIndex(
            'orders',
            new TableIndex({
                name: 'IDX_ORDER_CREATED',
                columnNames: ['created_at'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('orders', true);
    }
}
