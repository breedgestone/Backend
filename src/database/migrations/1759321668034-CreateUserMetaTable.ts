import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateUserMetaTable1759321668034 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_meta',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isUnique: true,
                    },
                    {
                        name: 'gender',
                        type: 'varchar',
                        length: '10',
                        isNullable: true,
                    },
                    {
                        name: 'date_of_birth',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'bio',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'city',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'state',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'country',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'fcm_token',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'last_seen',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        // Create foreign key to users table
        await queryRunner.createForeignKey(
            'user_meta',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
                name: 'FK_USER_META_USER',
            }),
        );

        // Create indexes as defined in the entity
        await queryRunner.createIndex(
            'user_meta',
            new TableIndex({
                name: 'IDX_USER_META_USER_ID',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createIndex(
            'user_meta',
            new TableIndex({
                name: 'IDX_USER_META_CITY',
                columnNames: ['city'],
            }),
        );

        await queryRunner.createIndex(
            'user_meta',
            new TableIndex({
                name: 'IDX_USER_META_COUNTRY',
                columnNames: ['country'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('user_meta', 'IDX_USER_META_COUNTRY');
        await queryRunner.dropIndex('user_meta', 'IDX_USER_META_CITY');
        await queryRunner.dropIndex('user_meta', 'IDX_USER_META_USER_ID');
        await queryRunner.dropForeignKey('user_meta', 'FK_USER_META_USER');
        await queryRunner.dropTable('user_meta');
    }

}
