import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCartProductsTable1736528460000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cart_product',
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
                        name: 'cart_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'sub_category_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'product_id',
                        type: 'bigint',
                        unsigned: true,
                        isNullable: true,
                    },
                    {
                        name: 'quantity',
                        type: 'int',
                        default: 1,
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

        // Create foreign key for cart_id
        await queryRunner.createForeignKey(
            'cart_product',
            new TableForeignKey({
                columnNames: ['cart_id'],
                referencedTableName: 'carts',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create foreign key for product_id
        await queryRunner.createForeignKey(
            'cart_product',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedTableName: 'product',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create indexes on foreign keys
        await queryRunner.createIndex(
            'cart_product',
            new TableIndex({
                name: 'IDX_CART_PRODUCT_CART',
                columnNames: ['cart_id'],
            }),
        );

        await queryRunner.createIndex(
            'cart_product',
            new TableIndex({
                name: 'IDX_CART_PRODUCT_PRODUCT',
                columnNames: ['product_id'],
            }),
        );

        // Create composite index for cart and product
        await queryRunner.createIndex(
            'cart_product',
            new TableIndex({
                name: 'IDX_CART_PRODUCT_UNIQUE',
                columnNames: ['cart_id', 'product_id'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cart_product', true);
    }
}
