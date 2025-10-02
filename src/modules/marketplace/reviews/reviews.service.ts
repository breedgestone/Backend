import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewableType } from '../../../common/enums';
import { CreateReviewDto, UpdateReviewDto } from './dto';

/**
 * Reviews Service
 * 
 * Handles all review operations for products, properties, and agents
 * Features:
 * - Create, update, delete reviews
 * - Get reviews for specific items
 * - Calculate average ratings
 * - Prevent duplicate reviews by same user
 * - User can only edit/delete their own reviews
 */
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  /**
   * Create a new review
   * Prevents duplicate reviews from the same user for the same item
   */
  async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
    // Check if user already reviewed this item
    const existingReview = await this.reviewRepository.findOne({
      where: {
        reviewable_type: createReviewDto.reviewable_type,
        reviewable_id: createReviewDto.reviewable_id,
        user_id: userId,
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        `You have already reviewed this ${createReviewDto.reviewable_type}`,
      );
    }

    // Validate rating is within range
    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5 stars');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user_id: userId,
      is_verified: false, // Can be updated later based on purchase verification
      is_active: true,
    });

    return this.reviewRepository.save(review);
  }

  /**
   * Get all reviews for a specific item (product, property, or agent)
   */
  async findByReviewable(
    reviewableType: ReviewableType,
    reviewableId: number,
  ): Promise<Review[]> {
    return this.reviewRepository.find({
      where: {
        reviewable_type: reviewableType,
        reviewable_id: reviewableId,
        is_active: true,
      },
      relations: ['user'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * Get all reviews by a specific user
   */
  async findByUser(userId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: {
        user_id: userId,
        is_active: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  /**
   * Get a single review by ID
   */
  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  /**
   * Update a review (only by the user who created it)
   */
  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: number,
  ): Promise<Review> {
    const review = await this.findOne(id);

    // Check if user owns this review
    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // Validate rating if provided
    if (updateReviewDto.rating && (updateReviewDto.rating < 1 || updateReviewDto.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5 stars');
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  /**
   * Delete a review (only by the user who created it)
   */
  async remove(id: number, userId: number): Promise<void> {
    const review = await this.findOne(id);

    // Check if user owns this review
    if (review.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }

  /**
   * Calculate average rating for a specific item
   */
  async getAverageRating(
    reviewableType: ReviewableType,
    reviewableId: number,
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'total')
      .where('review.reviewable_type = :reviewableType', { reviewableType })
      .andWhere('review.reviewable_id = :reviewableId', { reviewableId })
      .andWhere('review.is_active = :isActive', { isActive: true })
      .getRawOne();

    return {
      averageRating: parseFloat(result.average) || 0,
      totalReviews: parseInt(result.total) || 0,
    };
  }

  /**
   * Get rating distribution (how many 1-star, 2-star, etc.)
   */
  async getRatingDistribution(
    reviewableType: ReviewableType,
    reviewableId: number,
  ): Promise<{ rating: number; count: number }[]> {
    const distribution = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.reviewable_type = :reviewableType', { reviewableType })
      .andWhere('review.reviewable_id = :reviewableId', { reviewableId })
      .andWhere('review.is_active = :isActive', { isActive: true })
      .groupBy('review.rating')
      .orderBy('review.rating', 'DESC')
      .getRawMany();

    return distribution.map((item) => ({
      rating: parseInt(item.rating),
      count: parseInt(item.count),
    }));
  }

  /**
   * Admin: Deactivate a review (for inappropriate content)
   */
  async deactivateReview(id: number): Promise<Review> {
    const review = await this.findOne(id);
    review.is_active = false;
    return this.reviewRepository.save(review);
  }

  /**
   * Admin: Activate a review
   */
  async activateReview(id: number): Promise<Review> {
    const review = await this.findOne(id);
    review.is_active = true;
    return this.reviewRepository.save(review);
  }

  /**
   * Mark review as verified (user actually purchased/used the service)
   */
  async verifyReview(id: number): Promise<Review> {
    const review = await this.findOne(id);
    review.is_verified = true;
    return this.reviewRepository.save(review);
  }
}
