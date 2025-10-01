import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUsersTable1759321646506 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
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
                        isUnique: true,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        length: '20',
                        isNullable: true,
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'profile_picture',
                        type: 'varchar',
                        length: '500',
                        isNullable: true,
                    },
                    {
                        name: 'role',
                        type: 'enum',
                        enum: ['admin', 'agent', 'user'],
                        default: "'user'",
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['active', 'inactive', 'suspended', 'pending_verification', 'banned'],
                        default: "'pending_verification'",
                    },
                    {
                        name: 'email_verified',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'phone_verified',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'identity_verified',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'verification_token',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'verification_token_expires',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'reset_password_otp',
                        type: 'varchar',
                        length: '10',
                        isNullable: true,
                    },
                    {
                        name: 'reset_password_otp_expires',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'last_login',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true,
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

        // Create indexes as defined in the entity
        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_EMAIL',
                columnNames: ['email'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_PHONE',
                columnNames: ['phone'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_ROLE',
                columnNames: ['role'],
            }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                name: 'IDX_USERS_STATUS',
                columnNames: ['status'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('users', 'IDX_USERS_STATUS');
        await queryRunner.dropIndex('users', 'IDX_USERS_ROLE');
        await queryRunner.dropIndex('users', 'IDX_USERS_PHONE');
        await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
        await queryRunner.dropTable('users');
    }

}
