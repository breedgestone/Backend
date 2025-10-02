import { DataSource } from 'typeorm';
import { Category } from '../../modules/marketplace/categories/entities/category.entity';

/**
 * Category Seeder
 * Creates marketplace categories
 */
export class CategorySeeder {
  async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    // Check if categories already exist
    const existingCategories = await categoryRepository.count();
    if (existingCategories > 0) {
      console.log('Categories already exist, skipping category seed');
      return;
    }

    const categories = [
      {
        name: 'Construction Materials',
        slug: 'construction-materials',
        description: 'Building materials, cement, blocks, steel, etc.',
        status: 1,
      },
      {
        name: 'Hardware & Tools',
        slug: 'hardware-tools',
        description: 'Construction tools, hardware, equipment',
        status: 1,
      },
      {
        name: 'Plumbing & Fixtures',
        slug: 'plumbing-fixtures',
        description: 'Pipes, taps, bathroom fixtures, water systems',
        status: 1,
      },
      {
        name: 'Electrical Supplies',
        slug: 'electrical-supplies',
        description: 'Cables, switches, lighting, electrical fittings',
        status: 1,
      },
      {
        name: 'Paint & Finishes',
        slug: 'paint-finishes',
        description: 'Paints, varnishes, wallpapers, decorative finishes',
        status: 1,
      },
      {
        name: 'Roofing Materials',
        slug: 'roofing-materials',
        description: 'Roofing sheets, tiles, gutters',
        status: 1,
      },
      {
        name: 'Doors & Windows',
        slug: 'doors-windows',
        description: 'Doors, windows, frames, security doors',
        status: 1,
      },
      {
        name: 'Tiles & Flooring',
        slug: 'tiles-flooring',
        description: 'Floor tiles, wall tiles, marble, granite',
        status: 1,
      },
    ];

    const createdCategories = await categoryRepository.save(categories);
    console.log(`✅ Seeded ${createdCategories.length} categories`);
  }
}
