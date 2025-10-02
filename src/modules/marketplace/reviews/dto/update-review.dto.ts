import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Updated rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 4,
    required: false,
  })
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  @IsOptional()
  rating?: number;

  @ApiProperty({
    description: 'Updated review comment/feedback',
    required: false,
    example: 'Updated review comment.',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
