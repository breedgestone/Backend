import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateChatTables1759321700000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create chats table
        await queryRunner.createTable(
            new Table({
                name: 'chats',
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
                        name: 'user1_id',
                        type: 'int',
                    },
                    {
                        name: 'user2_id',
                        type: 'int',
                    },
                    {
                        name: 'subject',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['active', 'closed'],
                        default: "'active'",
                    },
                    {
                        name: 'unread_user1',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'unread_user2',
                        type: 'int',
                        default: 0,
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

        // Create foreign key for user1_id
        await queryRunner.createForeignKey(
            'chats',
            new TableForeignKey({
                columnNames: ['user1_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create foreign key for user2_id
        await queryRunner.createForeignKey(
            'chats',
            new TableForeignKey({
                columnNames: ['user2_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create indexes on foreign keys for better query performance
        await queryRunner.createIndex(
            'chats',
            new TableIndex({
                name: 'IDX_CHAT_USER1',
                columnNames: ['user1_id'],
            }),
        );

        await queryRunner.createIndex(
            'chats',
            new TableIndex({
                name: 'IDX_CHAT_USER2',
                columnNames: ['user2_id'],
            }),
        );

        // Create index on status for filtering
        await queryRunner.createIndex(
            'chats',
            new TableIndex({
                name: 'IDX_CHAT_STATUS',
                columnNames: ['status'],
            }),
        );

        // Create chat_messages table
        await queryRunner.createTable(
            new Table({
                name: 'chat_messages',
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
                        name: 'chat_id',
                        type: 'bigint',
                        unsigned: true,
                    },
                    {
                        name: 'sender_id',
                        type: 'int',
                    },
                    {
                        name: 'message',
                        type: 'text',
                    },
                    {
                        name: 'is_read',
                        type: 'boolean',
                        default: false,
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

        // Create foreign key for chat_id
        await queryRunner.createForeignKey(
            'chat_messages',
            new TableForeignKey({
                columnNames: ['chat_id'],
                referencedTableName: 'chats',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create foreign key for sender_id
        await queryRunner.createForeignKey(
            'chat_messages',
            new TableForeignKey({
                columnNames: ['sender_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT',
            }),
        );

        // Create indexes on foreign keys
        await queryRunner.createIndex(
            'chat_messages',
            new TableIndex({
                name: 'IDX_CHAT_MESSAGE_CHAT',
                columnNames: ['chat_id'],
            }),
        );

        await queryRunner.createIndex(
            'chat_messages',
            new TableIndex({
                name: 'IDX_CHAT_MESSAGE_SENDER',
                columnNames: ['sender_id'],
            }),
        );

        // Create index on is_read for filtering unread messages
        await queryRunner.createIndex(
            'chat_messages',
            new TableIndex({
                name: 'IDX_CHAT_MESSAGE_READ',
                columnNames: ['is_read'],
            }),
        );

        // Create composite index for efficient querying of chat messages
        await queryRunner.createIndex(
            'chat_messages',
            new TableIndex({
                name: 'IDX_CHAT_MESSAGE_CHAT_CREATED',
                columnNames: ['chat_id', 'created_at'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop chat_messages table first (due to foreign key constraints)
        await queryRunner.dropTable('chat_messages', true);

        // Drop chats table
        await queryRunner.dropTable('chats', true);
    }
}
