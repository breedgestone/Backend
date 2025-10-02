import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { UserRole, UserStatus } from '../../common/enums';

/**
 * User Seeder
 * Creates test users with different roles
 */
export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping user seed');
      return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      // Admin
      {
        email: 'admin@breedgestone.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+2341234567890',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      // Agents
      {
        email: 'agent1@breedgestone.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Realtor',
        phone: '+2341234567891',
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      {
        email: 'agent2@breedgestone.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Properties',
        phone: '+2341234567892',
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      // Users/Customers
      {
        email: 'customer1@test.com',
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Johnson',
        phone: '+2341234567893',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      {
        email: 'customer2@test.com',
        password: hashedPassword,
        firstName: 'Emily',
        lastName: 'Williams',
        phone: '+2341234567894',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      {
        email: 'customer3@test.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Brown',
        phone: '+2341234567895',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    ];

    const createdUsers = await userRepository.save(users);
    console.log(`✅ Seeded ${createdUsers.length} users`);
  }
}
