import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateUserAuthProvidersTable1759321683488 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_auth_providers',
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
                    },
                    {
                        name: 'provider',
                        type: 'enum',
                        enum: ['local', 'google', 'facebook'],
                    },
                    {
                        name: 'provider_id',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'json',
                        isNullable: true,
                    },
                    {
                        name: 'linked_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        precision: 6,
                        default: 'CURRENT_TIMESTAMP(6)',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        precision: 6,
                        default: 'CURRENT_TIMESTAMP(6)',
                        onUpdate: 'CURRENT_TIMESTAMP(6)',
                    },
                ],
            }),
            true,
        );

        // Create foreign key to users table
        await queryRunner.createForeignKey(
            'user_auth_providers',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
                name: 'FK_USER_AUTH_PROVIDERS_USER',
            }),
        );

        // Create unique constraint on provider + provider_id
        await queryRunner.createIndex(
            'user_auth_providers',
            new TableIndex({
                name: 'UQ_USER_AUTH_PROVIDER',
                columnNames: ['provider', 'provider_id'],
                isUnique: true,
            }),
        );

        // Create indexes as defined in the entity
        await queryRunner.createIndex(
            'user_auth_providers',
            new TableIndex({
                name: 'IDX_USER_AUTH_PROVIDERS_USER_ID',
                columnNames: ['user_id'],
            }),
        );

        await queryRunner.createIndex(
            'user_auth_providers',
            new TableIndex({
                name: 'IDX_USER_AUTH_PROVIDERS_PROVIDER',
                columnNames: ['provider'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('user_auth_providers', 'IDX_USER_AUTH_PROVIDERS_PROVIDER');
        await queryRunner.dropIndex('user_auth_providers', 'IDX_USER_AUTH_PROVIDERS_USER_ID');
        await queryRunner.dropIndex('user_auth_providers', 'UQ_USER_AUTH_PROVIDER');
        await queryRunner.dropForeignKey('user_auth_providers', 'FK_USER_AUTH_PROVIDERS_USER');
        await queryRunner.dropTable('user_auth_providers');
    }

}
