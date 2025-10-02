import { DataSource } from 'typeorm';
import { Property } from '../../modules/property/entities/property.entity';
import { User } from '../../modules/users/entities/user.entity';
import { 
  PropertyStatus, 
  PropertyType, 
  PropertySize, 
  FurnishingType,
  UserRole 
} from '../../common/enums';

/**
 * Property Seeder
 * Creates test properties listed by agents
 */
export class PropertySeeder {
  async run(dataSource: DataSource): Promise<void> {
    const propertyRepository = dataSource.getRepository(Property);
    const userRepository = dataSource.getRepository(User);

    // Check if properties already exist
    const existingProperties = await propertyRepository.count();
    if (existingProperties > 0) {
      console.log('Properties already exist, skipping property seed');
      return;
    }

    // Get agents
    const agents = await userRepository.find({ where: { role: UserRole.AGENT } });
    if (agents.length === 0) {
      console.log('No agents found, skipping property seed');
      return;
    }

    console.log(`Found ${agents.length} agents:`, agents.map(a => ({ id: a.id, email: a.email })));

    const properties = [
      {
        title: '3 Bedroom Apartment in Lekki Phase 1',
        description: 'Beautiful 3 bedroom apartment with modern amenities. Features spacious living room, fitted kitchen, and ample parking space. Located in a serene environment.',
        address: '15 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        state: 'Lagos',
        price: 25000000,
        type: PropertyType.APARTMENT,
        propertySize: PropertySize.LARGE,
        furnishing: FurnishingType.FURNISHED,
        bedrooms: 3,
        bathrooms: 3,
        status: PropertyStatus.APPROVED,
        agentId: agents[0].id,
      },
      {
        title: '5 Bedroom House in Victoria Island',
        description: 'Luxurious 5 bedroom house with swimming pool and gym. All rooms en-suite, modern kitchen with appliances, and 24/7 security.',
        address: '42 Ozumba Mbadiwe Avenue, Victoria Island',
        city: 'Lagos',
        state: 'Lagos',
        price: 85000000,
        type: PropertyType.HOUSE,
        propertySize: PropertySize.LARGE,
        furnishing: FurnishingType.FURNISHED,
        bedrooms: 5,
        bathrooms: 6,
        status: PropertyStatus.APPROVED,
        agentId: agents[0].id,
      },
      {
        title: '2 Bedroom House in Ikeja',
        description: 'Cozy 2 bedroom house perfect for small families. Quiet neighborhood with good security.',
        address: '8 Allen Avenue, Ikeja',
        city: 'Lagos',
        state: 'Lagos',
        price: 15000000,
        type: PropertyType.HOUSE,
        propertySize: PropertySize.MEDIUM,
        furnishing: FurnishingType.SEMI_FURNISHED,
        bedrooms: 2,
        bathrooms: 2,
        status: PropertyStatus.APPROVED,
        agentId: agents[1]?.id || agents[0].id,
      },
      {
        title: 'Studio Apartment in Yaba',
        description: 'Modern studio apartment ideal for young professionals. Close to tech hubs and universities.',
        address: '25 Herbert Macaulay Way, Yaba',
        city: 'Lagos',
        state: 'Lagos',
        price: 8000000,
        type: PropertyType.APARTMENT,
        propertySize: PropertySize.SMALL,
        furnishing: FurnishingType.UNFURNISHED,
        bedrooms: 1,
        bathrooms: 1,
        status: PropertyStatus.APPROVED,
        agentId: agents[1]?.id || agents[0].id,
      },
      {
        title: '4 Bedroom House in Ajah',
        description: 'Newly built 4 bedroom house with BQ. Secure estate with good road network and constant power supply.',
        address: 'Ado Road, Ajah',
        city: 'Lagos',
        state: 'Lagos',
        price: 35000000,
        type: PropertyType.HOUSE,
        propertySize: PropertySize.LARGE,
        furnishing: FurnishingType.SEMI_FURNISHED,
        bedrooms: 4,
        bathrooms: 5,
        status: PropertyStatus.APPROVED,
        agentId: agents[0].id,
      },
      {
        title: 'Prime Commercial Property in Banana Island',
        description: 'Exclusive commercial property with state-of-the-art facilities. Ideal for corporate offices or luxury retail.',
        address: 'Banana Island Road, Ikoyi',
        city: 'Lagos',
        state: 'Lagos',
        price: 250000000,
        type: PropertyType.COMMERCIAL,
        propertySize: PropertySize.EXTRA_LARGE,
        furnishing: FurnishingType.FURNISHED,
        bedrooms: 0,
        bathrooms: 4,
        status: PropertyStatus.APPROVED,
        agentId: agents[0].id,
      },
      {
        title: '3 Bedroom Apartment in Maryland',
        description: 'Affordable 3 bedroom apartment in a quiet neighborhood. Close to shopping centers and schools.',
        address: 'Ikorodu Road, Maryland',
        city: 'Lagos',
        state: 'Lagos',
        price: 18000000,
        type: PropertyType.APARTMENT,
        propertySize: PropertySize.MEDIUM,
        furnishing: FurnishingType.UNFURNISHED,
        bedrooms: 3,
        bathrooms: 2,
        status: PropertyStatus.APPROVED,
        agentId: agents[1]?.id || agents[0].id,
      },
      {
        title: 'Office Space in Magodo',
        description: 'Well-maintained office space in a gated estate. Features modern fittings and ample parking.',
        address: 'CMD Road, Magodo Phase 2',
        city: 'Lagos',
        state: 'Lagos',
        price: 45000000,
        type: PropertyType.OFFICE,
        propertySize: PropertySize.LARGE,
        furnishing: FurnishingType.SEMI_FURNISHED,
        bedrooms: 0,
        bathrooms: 3,
        status: PropertyStatus.PENDING_APPROVAL,
        agentId: agents[0].id,
      },
      {
        title: 'Land for Sale in Ibeju-Lekki',
        description: 'Prime land for residential or commercial development. Good title, fenced and gated.',
        address: 'Lekki-Epe Expressway, Ibeju-Lekki',
        city: 'Lagos',
        state: 'Lagos',
        price: 50000000,
        type: PropertyType.LAND,
        propertySize: PropertySize.EXTRA_LARGE,
        furnishing: FurnishingType.UNFURNISHED,
        bedrooms: 0,
        bathrooms: 0,
        status: PropertyStatus.APPROVED,
        agentId: agents[0].id,
      },
    ];

    const createdProperties = await propertyRepository.save(properties);
    console.log(`✅ Seeded ${createdProperties.length} properties`);
  }
}
