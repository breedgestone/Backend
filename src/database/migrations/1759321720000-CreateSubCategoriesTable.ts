import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class CreateSubCategoriesTable1759321720000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'sub_category',
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
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
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
                        name: 'asset_id',
                        type: 'bigint',
                        unsigned: true,
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

        // Create index on slug for faster lookups
        await queryRunner.createIndex(
            'sub_category',
            new TableIndex({
                name: 'IDX_SUB_CATEGORY_SLUG',
                columnNames: ['slug'],
            }),
        );

        // Create index on status for filtering
        await queryRunner.createIndex(
            'sub_category',
            new TableIndex({
                name: 'IDX_SUB_CATEGORY_STATUS',
                columnNames: ['status'],
            }),
        );

        // Create foreign key for asset_id
        await queryRunner.createForeignKey(
            'sub_category',
            new TableForeignKey({
                columnNames: ['asset_id'],
                referencedTableName: 'assets',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
                name: 'fk_sub_category_asset',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('sub_category', 'fk_sub_category_asset');
        await queryRunner.dropTable('sub_category', true);
    }
}
