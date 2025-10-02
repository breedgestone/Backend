import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReviewableType } from '../../../common/enums';

/**
 * Reviews Controller
 * 
 * Endpoints:
 * - POST /reviews - Create a review (authenticated)
 * - GET /reviews/product/:id - Get all reviews for a product
 * - GET /reviews/property/:id - Get all reviews for a property
 * - GET /reviews/agent/:id - Get all reviews for an agent
 * - GET /reviews/my-reviews - Get current user's reviews
 * - GET /reviews/:id - Get a specific review
 * - PATCH /reviews/:id - Update a review (own review only)
 * - DELETE /reviews/:id - Delete a review (own review only)
 * - GET /reviews/product/:id/stats - Get rating statistics for a product
 * - GET /reviews/property/:id/stats - Get rating statistics for a property
 * - GET /reviews/agent/:id/stats - Get rating statistics for an agent
 */
@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a new review
   * Requires authentication
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or duplicate review' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  /**
   * Get all reviews for a specific product
   */
  @Get('product/:id')
  @ApiOperation({ summary: 'Get all reviews for a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of product reviews' })
  getProductReviews(@Param('id') id: string) {
    return this.reviewsService.findByReviewable(ReviewableType.PRODUCT, +id);
  }

  /**
   * Get all reviews for a specific property
   */
  @Get('property/:id')
  @ApiOperation({ summary: 'Get all reviews for a property' })
  @ApiParam({ name: 'id', description: 'Property ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of property reviews' })
  getPropertyReviews(@Param('id') id: string) {
    return this.reviewsService.findByReviewable(ReviewableType.PROPERTY, +id);
  }

  /**
   * Get all reviews for a specific agent
   */
  @Get('agent/:id')
  @ApiOperation({ summary: 'Get all reviews for an agent' })
  @ApiParam({ name: 'id', description: 'Agent/User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of agent reviews' })
  getAgentReviews(@Param('id') id: string) {
    return this.reviewsService.findByReviewable(ReviewableType.AGENT, +id);
  }

  /**
   * Get rating statistics for a product
   * Returns average rating, total reviews, and rating distribution
   */
  @Get('product/:id/stats')
  @ApiOperation({ summary: 'Get rating statistics for a product' })
  @ApiParam({ name: 'id', description: 'Product ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product rating statistics',
    schema: {
      example: {
        averageRating: 4.5,
        totalReviews: 10,
        distribution: [
          { rating: 5, count: 6 },
          { rating: 4, count: 3 },
          { rating: 3, count: 1 },
        ]
      }
    }
  })
  async getProductStats(@Param('id') id: string) {
    const [average, distribution] = await Promise.all([
      this.reviewsService.getAverageRating(ReviewableType.PRODUCT, +id),
      this.reviewsService.getRatingDistribution(ReviewableType.PRODUCT, +id),
    ]);

    return {
      ...average,
      distribution,
    };
  }

  /**
   * Get rating statistics for a property
   */
  @Get('property/:id/stats')
  @ApiOperation({ summary: 'Get rating statistics for a property' })
  @ApiParam({ name: 'id', description: 'Property ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Property rating statistics',
    schema: {
      example: {
        averageRating: 4.2,
        totalReviews: 8,
        distribution: [
          { rating: 5, count: 4 },
          { rating: 4, count: 3 },
          { rating: 3, count: 1 },
        ]
      }
    }
  })
  async getPropertyStats(@Param('id') id: string) {
    const [average, distribution] = await Promise.all([
      this.reviewsService.getAverageRating(ReviewableType.PROPERTY, +id),
      this.reviewsService.getRatingDistribution(ReviewableType.PROPERTY, +id),
    ]);

    return {
      ...average,
      distribution,
    };
  }

  /**
   * Get rating statistics for an agent
   */
  @Get('agent/:id/stats')
  @ApiOperation({ summary: 'Get rating statistics for an agent' })
  @ApiParam({ name: 'id', description: 'Agent/User ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Agent rating statistics',
    schema: {
      example: {
        averageRating: 4.8,
        totalReviews: 15,
        distribution: [
          { rating: 5, count: 12 },
          { rating: 4, count: 2 },
          { rating: 3, count: 1 },
        ]
      }
    }
  })
  async getAgentStats(@Param('id') id: string) {
    const [average, distribution] = await Promise.all([
      this.reviewsService.getAverageRating(ReviewableType.AGENT, +id),
      this.reviewsService.getRatingDistribution(ReviewableType.AGENT, +id),
    ]);

    return {
      ...average,
      distribution,
    };
  }

  /**
   * Get all reviews by the current user
   * Requires authentication
   */
  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews created by the current user' })
  @ApiResponse({ status: 200, description: 'List of user reviews' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyReviews(@Request() req) {
    return this.reviewsService.findByUser(req.user.id);
  }

  /**
   * Get a specific review by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Review details' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  /**
   * Update a review (user can only update their own)
   * Requires authentication
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review (own review only)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return this.reviewsService.update(+id, updateReviewDto, req.user.id);
  }

  /**
   * Delete a review (user can only delete their own)
   * Requires authentication
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review (own review only)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewsService.remove(+id, req.user.id);
  }
}
