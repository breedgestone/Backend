import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateOrderItemsTable1759321780000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order_items',
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
                        name: 'order_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'product_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'variation_id',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'quantity',
                        type: 'int',
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 20,
                        scale: 2,
                    },
                    {
                        name: 'total',
                        type: 'decimal',
                        precision: 20,
                        scale: 2,
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

        // Create foreign key for order_id
        await queryRunner.createForeignKey(
            'order_items',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedTableName: 'orders',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create foreign key for product_id
        await queryRunner.createForeignKey(
            'order_items',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedTableName: 'product',
                referencedColumnNames: ['id'],
                onDelete: 'RESTRICT',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create indexes on foreign keys
        await queryRunner.createIndex(
            'order_items',
            new TableIndex({
                name: 'IDX_ORDER_ITEM_ORDER',
                columnNames: ['order_id'],
            }),
        );

        await queryRunner.createIndex(
            'order_items',
            new TableIndex({
                name: 'IDX_ORDER_ITEM_PRODUCT',
                columnNames: ['product_id'],
            }),
        );

        // Create composite index for efficient querying
        await queryRunner.createIndex(
            'order_items',
            new TableIndex({
                name: 'IDX_ORDER_ITEM_ORDER_PRODUCT',
                columnNames: ['order_id', 'product_id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('order_items', true);
    }
}
