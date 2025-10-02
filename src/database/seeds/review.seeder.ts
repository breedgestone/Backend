import { DataSource } from 'typeorm';
import { Review } from '../../modules/marketplace/reviews/entities/review.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Product } from '../../modules/marketplace/products/entities/product.entity';
import { Property } from '../../modules/property/entities/property.entity';
import { ReviewableType, UserRole } from '../../common/enums';

/**
 * Review Seeder
 * Creates test reviews for products, properties, and agents
 */
export class ReviewSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const reviewRepository = dataSource.getRepository(Review);
    const userRepository = dataSource.getRepository(User);
    const productRepository = dataSource.getRepository(Product);
    const propertyRepository = dataSource.getRepository(Property);

    // Check if reviews already exist
    const existingReviews = await reviewRepository.count();
    if (existingReviews > 0) {
      console.log('Reviews already exist, skipping review seed');
      return;
    }

    const customers = await userRepository.find({ where: { role: UserRole.USER } });
    const agents = await userRepository.find({ where: { role: UserRole.AGENT } });
    const products = await productRepository.find({ take: 10 });
    const properties = await propertyRepository.find({ take: 5 });

    if (customers.length === 0 || products.length === 0) {
      console.log('Not enough data for reviews, skipping review seed');
      return;
    }

    const reviews: any[] = [];

    // Product Reviews
    products.slice(0, 5).forEach((product, index) => {
      reviews.push({
        reviewable_type: ReviewableType.PRODUCT,
        reviewable_id: product.id,
        user_id: customers[index % customers.length].id,
        rating: 5,
        comment: 'Excellent product! High quality and exactly as described. Fast delivery too.',
        is_verified: true,
        is_active: true,
      });
    });

    products.slice(5, 8).forEach((product, index) => {
      reviews.push({
        reviewable_type: ReviewableType.PRODUCT,
        reviewable_id: product.id,
        user_id: customers[(index + 1) % customers.length].id,
        rating: 4,
        comment: 'Very good product. Would recommend to others. Minor issue with packaging but product itself is great.',
        is_verified: true,
        is_active: true,
      });
    });

    // Property Reviews
    properties.slice(0, 3).forEach((property, index) => {
      reviews.push({
        reviewable_type: ReviewableType.PROPERTY,
        reviewable_id: property.id,
        user_id: customers[index % customers.length].id,
        rating: 5,
        comment: 'Beautiful property! The location is perfect and all amenities are as advertised. Highly recommend!',
        is_verified: true,
        is_active: true,
      });
    });

    // Agent Reviews
    agents.forEach((agent, index) => {
      reviews.push({
        reviewable_type: ReviewableType.AGENT,
        reviewable_id: agent.id,
        user_id: customers[index % customers.length].id,
        rating: 5,
        comment: 'Excellent agent! Very professional, responsive, and knowledgeable. Made the entire process smooth.',
        is_verified: true,
        is_active: true,
      });

      reviews.push({
        reviewable_type: ReviewableType.AGENT,
        reviewable_id: agent.id,
        user_id: customers[(index + 1) % customers.length].id,
        rating: 4,
        comment: 'Good service overall. Agent was helpful and patient with all our questions.',
        is_verified: true,
        is_active: true,
      });
    });

    const createdReviews = await reviewRepository.save(reviews);
    console.log(`✅ Seeded ${createdReviews.length} reviews`);
  }
}
