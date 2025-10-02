import { DataSource } from 'typeorm';
import { Product } from '../../modules/marketplace/products/entities/product.entity';
import { Category } from '../../modules/marketplace/categories/entities/category.entity';
import { SubCategory } from '../../modules/marketplace/categories/entities/sub-category.entity';
import { CategorySub } from '../../modules/marketplace/categories/entities/category-sub.entity';

/**
 * Product Seeder
 * Creates subcategories, links them to categories, and creates products
 */
export class ProductSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(Category);
    const subCategoryRepository = dataSource.getRepository(SubCategory);
    const categorySubRepository = dataSource.getRepository(CategorySub);

    // Check if products already exist
    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      console.log('Products already exist, skipping product seed');
      return;
    }

    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      console.log('No categories found, skipping product seed');
      return;
    }

    // Create subcategories and link to categories
    const subCategoryData = [
      { name: 'Cement & Aggregates', slug: 'cement-aggregates', description: 'Cement, sand, gravel', categoryName: 'Construction Materials' },
      { name: 'Building Blocks', slug: 'building-blocks', description: 'Concrete blocks, bricks', categoryName: 'Construction Materials' },
      { name: 'Steel & Iron', slug: 'steel-iron', description: 'Reinforcement bars, steel', categoryName: 'Construction Materials' },
      { name: 'Power Tools', slug: 'power-tools', description: 'Drills, saws, grinders', categoryName: 'Hardware & Tools' },
      { name: 'Hand Tools', slug: 'hand-tools', description: 'Hammers, wrenches, screwdrivers', categoryName: 'Hardware & Tools' },
      { name: 'Pipes & Fittings', slug: 'pipes-fittings', description: 'PVC pipes, copper pipes', categoryName: 'Plumbing & Fixtures' },
      { name: 'Bathroom Fixtures', slug: 'bathroom-fixtures', description: 'Sinks, toilets, showers', categoryName: 'Plumbing & Fixtures' },
      { name: 'General Electrical', slug: 'general-electrical', description: 'Electrical supplies', categoryName: 'Electrical Supplies' },
      { name: 'General Paint', slug: 'general-paint', description: 'Paint products', categoryName: 'Paint & Finishes' },
      { name: 'General Roofing', slug: 'general-roofing', description: 'Roofing materials', categoryName: 'Roofing Materials' },
      { name: 'General Doors & Windows', slug: 'general-doors-windows', description: 'Doors and windows', categoryName: 'Doors & Windows' },
      { name: 'General Tiles', slug: 'general-tiles', description: 'Tiles and flooring', categoryName: 'Tiles & Flooring' },
    ];

    const createdSubCategories = new Map<string, SubCategory>();
    
    for (const subCat of subCategoryData) {
      const category = categories.find(c => c.name === subCat.categoryName);
      if (category) {
        const subCategory = await subCategoryRepository.save({
          name: subCat.name,
          slug: subCat.slug,
          description: subCat.description,
          status: 1,
        });
        createdSubCategories.set(subCat.name, subCategory);
        
        // Link subcategory to category
        await categorySubRepository.save({
          categoryId: category.id,
          subCategoryId: subCategory.id,
        });
      }
    }

    console.log(`✅ Seeded ${createdSubCategories.size} subcategories`);

    // Create products
    const products = [
      // Cement & Aggregates
      {
        name: 'Premium Cement - 50kg',
        description: 'High-quality Portland cement suitable for all construction needs',
        price: 4500.00,
        priceUnit: 'per bag',
        subCategoryId: createdSubCategories.get('Cement & Aggregates')?.id,
        status: 1,
      },
      // Building Blocks
      {
        name: '9-inch Hollow Blocks',
        description: 'Standard hollow blocks for construction',
        price: 350.00,
        priceUnit: 'per piece',
        subCategoryId: createdSubCategories.get('Building Blocks')?.id,
        status: 1,
      },
      // Steel & Iron
      {
        name: 'Steel Rods 16mm (12 meters)',
        description: 'High tensile steel reinforcement bars',
        price: 8500.00,
        priceUnit: 'per rod',
        subCategoryId: createdSubCategories.get('Steel & Iron')?.id,
        status: 1,
      },
      // Power Tools
      {
        name: 'Professional Hammer Drill',
        description: 'Heavy-duty electric hammer drill with variable speed',
        price: 25000.00,
        priceUnit: 'per unit',
        subCategoryId: createdSubCategories.get('Power Tools')?.id,
        status: 1,
      },
      // Hand Tools
      {
        name: 'Tool Set - 25 Pieces',
        description: 'Complete tool set with wrenches, screwdrivers, pliers',
        price: 15000.00,
        priceUnit: 'per set',
        subCategoryId: createdSubCategories.get('Hand Tools')?.id,
        status: 1,
      },
      // Pipes & Fittings
      {
        name: 'PVC Pipes 4-inch (6 meters)',
        description: 'Durable PVC pipes for plumbing and drainage',
        price: 3500.00,
        priceUnit: 'per pipe',
        subCategoryId: createdSubCategories.get('Pipes & Fittings')?.id,
        status: 1,
      },
      // Bathroom Fixtures
      {
        name: 'Chrome Basin Mixer Tap',
        description: 'Modern chrome-plated basin tap with ceramic disc',
        price: 8500.00,
        priceUnit: 'per unit',
        subCategoryId: createdSubCategories.get('Bathroom Fixtures')?.id,
        status: 1,
      },
      {
        name: 'Water Closet (WC) - Modern Design',
        description: 'Contemporary toilet with dual flush system',
        price: 45000.00,
        priceUnit: 'per unit',
        subCategoryId: createdSubCategories.get('Bathroom Fixtures')?.id,
        status: 1,
      },
      // Electrical
      {
        name: 'Electrical Cable 2.5mm (100 meters)',
        description: 'High-quality copper electrical cable',
        price: 18000.00,
        priceUnit: 'per roll',
        subCategoryId: createdSubCategories.get('General Electrical')?.id,
        status: 1,
      },
      {
        name: 'LED Bulbs 15W - Pack of 10',
        description: 'Energy-efficient LED bulbs with 3-year warranty',
        price: 5000.00,
        priceUnit: 'per pack',
        subCategoryId: createdSubCategories.get('General Electrical')?.id,
        status: 1,
      },
      // Paint
      {
        name: 'Emulsion Paint - 25 Liters (White)',
        description: 'Premium quality washable emulsion paint',
        price: 32000.00,
        priceUnit: 'per bucket',
        subCategoryId: createdSubCategories.get('General Paint')?.id,
        status: 1,
      },
      {
        name: 'Gloss Paint - 4 Liters (Assorted Colors)',
        description: 'High gloss oil-based paint for doors and windows',
        price: 12000.00,
        priceUnit: 'per can',
        subCategoryId: createdSubCategories.get('General Paint')?.id,
        status: 1,
      },
      // Roofing
      {
        name: 'Aluminum Roofing Sheets - 0.5mm',
        description: 'Corrugated aluminum roofing sheets - 12ft length',
        price: 4800.00,
        priceUnit: 'per sheet',
        subCategoryId: createdSubCategories.get('General Roofing')?.id,
        status: 1,
      },
      {
        name: 'Stone-Coated Roofing Tiles',
        description: 'Premium stone-coated steel roofing tiles',
        price: 2500.00,
        priceUnit: 'per piece',
        subCategoryId: createdSubCategories.get('General Roofing')?.id,
        status: 1,
      },
      // Doors & Windows
      {
        name: 'Security Steel Door',
        description: 'Heavy-duty steel security door with reinforced frame',
        price: 85000.00,
        priceUnit: 'per unit',
        subCategoryId: createdSubCategories.get('General Doors & Windows')?.id,
        status: 1,
      },
      {
        name: 'Sliding Aluminum Window',
        description: 'Modern aluminum sliding window - 4ft x 4ft',
        price: 35000.00,
        priceUnit: 'per unit',
        subCategoryId: createdSubCategories.get('General Doors & Windows')?.id,
        status: 1,
      },
      // Tiles
      {
        name: 'Ceramic Floor Tiles 60x60cm',
        description: 'Porcelain ceramic floor tiles - Pack of 10',
        price: 15000.00,
        priceUnit: 'per pack',
        subCategoryId: createdSubCategories.get('General Tiles')?.id,
        status: 1,
      },
      {
        name: 'Granite Floor Tiles - Premium',
        description: 'Imported granite tiles with polished finish - 80x80cm',
        price: 28000.00,
        priceUnit: 'per piece',
        subCategoryId: createdSubCategories.get('General Tiles')?.id,
        status: 1,
      },
    ];

    const createdProducts = await productRepository.save(products);
    console.log(`✅ Seeded ${createdProducts.length} products`);
  }
}
