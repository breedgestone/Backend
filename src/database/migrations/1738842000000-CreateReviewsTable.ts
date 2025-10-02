import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateReviewsTable1738842000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'reviewable_type',
            type: 'varchar',
            length: '20',
            comment: 'Type of entity being reviewed (product, property, or agent)',
          },
          {
            name: 'reviewable_id',
            type: 'int',
            comment: 'ID of the entity being reviewed',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'rating',
            type: 'int',
            comment: 'Rating from 1-5 stars',
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            default: true,
            comment: 'Set if user actually purchased/used the service',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            comment: 'Can be deactivated by admin if inappropriate',
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

    // Create indexes
    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_REVIEWS_REVIEWABLE',
        columnNames: ['reviewable_type', 'reviewable_id'],
      }),
    );

    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_REVIEWS_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_REVIEWS_RATING',
        columnNames: ['rating'],
      }),
    );

    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_REVIEWS_REVIEWABLE_TYPE',
        columnNames: ['reviewable_type'],
      }),
    );

    // Create unique constraint to prevent duplicate reviews
    await queryRunner.createIndex(
      'reviews',
      new TableIndex({
        name: 'IDX_REVIEWS_UNIQUE_USER_REVIEWABLE',
        columnNames: ['user_id', 'reviewable_type', 'reviewable_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reviews');
  }
}
