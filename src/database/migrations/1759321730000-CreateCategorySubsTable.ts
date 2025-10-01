import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCategorySubsTable1759321730000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'category_subs',
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
                        name: 'category_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'sub_category_id',
                        type: 'bigint',
                        unsigned: true,
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

        // Create foreign key for category_id
        await queryRunner.createForeignKey(
            'category_subs',
            new TableForeignKey({
                columnNames: ['category_id'],
                referencedTableName: 'categories',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create foreign key for sub_category_id
        await queryRunner.createForeignKey(
            'category_subs',
            new TableForeignKey({
                columnNames: ['sub_category_id'],
                referencedTableName: 'sub_category',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create indexes on foreign keys
        await queryRunner.createIndex(
            'category_subs',
            new TableIndex({
                name: 'IDX_CATEGORY_SUB_CATEGORY',
                columnNames: ['category_id'],
            }),
        );

        await queryRunner.createIndex(
            'category_subs',
            new TableIndex({
                name: 'IDX_CATEGORY_SUB_SUB_CATEGORY',
                columnNames: ['sub_category_id'],
            }),
        );

        // Create unique composite index to prevent duplicate relationships
        await queryRunner.createIndex(
            'category_subs',
            new TableIndex({
                name: 'IDX_CATEGORY_SUB_UNIQUE',
                columnNames: ['category_id', 'sub_category_id'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('category_subs', true);
    }
}
