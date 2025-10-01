import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateProductsTable1736528440000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'product',
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
                        name: 'sub_category_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 12,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'price_unit',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'image_id',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'tinyint',
                        default: 1,
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

        // Create foreign key for sub_category_id
        await queryRunner.createForeignKey(
            'product',
            new TableForeignKey({
                columnNames: ['sub_category_id'],
                referencedTableName: 'sub_category',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create index on foreign key
        await queryRunner.createIndex(
            'product',
            new TableIndex({
                name: 'IDX_PRODUCT_SUB_CATEGORY',
                columnNames: ['sub_category_id'],
            }),
        );

        // Create index on status for filtering
        await queryRunner.createIndex(
            'product',
            new TableIndex({
                name: 'IDX_PRODUCT_STATUS',
                columnNames: ['status'],
            }),
        );

        // Create index on name for searching
        await queryRunner.createIndex(
            'product',
            new TableIndex({
                name: 'IDX_PRODUCT_NAME',
                columnNames: ['name'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('product', true);
    }
}
