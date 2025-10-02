import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserSeeder } from './user.seeder';
import { CategorySeeder } from './category.seeder';
import { ProductSeeder } from './product.seeder';
import { PropertySeeder } from './property.seeder';
import { ReviewSeeder } from './review.seeder';
import dataSource from '../../config/database';

// Load environment variables
config();

/**
 * Main Seeder
 * Runs all seeders in the correct order
 */
async function runSeeders() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Initialize database connection
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Database connection established\n');

    // Run seeders in order (respecting dependencies)
    const userSeeder = new UserSeeder();
    await userSeeder.run(dataSource);

    const categorySeeder = new CategorySeeder();
    await categorySeeder.run(dataSource);

    const productSeeder = new ProductSeeder();
    await productSeeder.run(dataSource);

    const propertySeeder = new PropertySeeder();
    await propertySeeder.run(dataSource);

    const reviewSeeder = new ReviewSeeder();
    await reviewSeeder.run(dataSource);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('-------------------');
    console.log('Admin:');
    console.log('  Email: admin@breedgestone.com');
    console.log('  Password: password123');
    console.log('\nAgent 1:');
    console.log('  Email: agent1@breedgestone.com');
    console.log('  Password: password123');
    console.log('\nAgent 2:');
    console.log('  Email: agent2@breedgestone.com');
    console.log('  Password: password123');
    console.log('\nCustomer 1:');
    console.log('  Email: customer1@test.com');
    console.log('  Password: password123');
    console.log('\nCustomer 2:');
    console.log('  Email: customer2@test.com');
    console.log('  Password: password123');
    console.log('\nCustomer 3:');
    console.log('  Email: customer3@test.com');
    console.log('  Password: password123');
    console.log('-------------------\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Close database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the seeders
runSeeders();
