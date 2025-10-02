import { IsEnum, IsInt, IsString, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewableType } from '../../../../common/enums';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Type of entity being reviewed',
    enum: ReviewableType,
    example: ReviewableType.PRODUCT,
  })
  @IsEnum(ReviewableType, { message: 'reviewable_type must be product, property, or agent' })
  @IsNotEmpty()
  reviewable_type: ReviewableType;

  @ApiProperty({
    description: 'ID of the entity being reviewed',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  reviewable_id: number;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'Review comment/feedback',
    required: false,
    example: 'Great product! Highly recommended.',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
