import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePropertyTable1759336426300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create properties table
    await queryRunner.createTable(
      new Table({
        name: 'properties',
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
            name: 'agent_id',
            type: 'int',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 15,
            scale: 2,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '500',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'country',
            type: 'varchar',
            length: '20',
            default: "'Nigeria'",
          },
          {
            name: 'bedrooms',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'bathrooms',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'area_sqm',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'property_size',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'furnishing',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'amenities',
            type: 'text',
            isNullable: true,
            comment: 'Comma-separated list of amenities',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'draft'",
          },
          {
            name: 'approved_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'rejection_reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'views',
            type: 'int',
            default: 0,
          },
          {
            name: 'is_featured',
            type: 'boolean',
            default: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
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

    // Create foreign key for agent_id
    await queryRunner.createForeignKey(
      'properties',
      new TableForeignKey({
        columnNames: ['agent_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        name: 'fk_property_agent',
      }),
    );

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX idx_property_status ON properties(status);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_type ON properties(type);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_agent ON properties(agent_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_price ON properties(price);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_city ON properties(city);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_state ON properties(state);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_featured ON properties(is_featured);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_property_deleted_at ON properties(deleted_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_deleted_at`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_featured`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_state`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_city`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_price`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_agent`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_type`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_property_status`);

    // Drop foreign keys
    await queryRunner.dropForeignKey('properties', 'fk_property_agent');

    // Drop table
    await queryRunner.dropTable('properties');
  }
}
