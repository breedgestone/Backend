import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Building Materials',
    description: 'Category name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'building-materials',
    description: 'URL-friendly category slug',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    example: 'All types of building and construction materials',
    description: 'Category description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'cat_img_123',
    description: 'Category image ID',
  })
  @IsOptional()
  @IsString()
  imageId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Category status (1=active, 0=inactive)',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}
