import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiProperty({
    example: 'Cement',
    description: 'Sub-category name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'cement',
    description: 'URL-friendly sub-category slug',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    example: 'Various types of cement for construction',
    description: 'Sub-category description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 5500,
    description: 'Base price for sub-category',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 'per bag',
    description: 'Price unit',
  })
  @IsOptional()
  @IsString()
  priceUnit?: string;

  @ApiPropertyOptional({
    example: 'subcat_img_123',
    description: 'Sub-category image ID',
  })
  @IsOptional()
  @IsString()
  imageId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Sub-category status (1=active, 0=inactive)',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}
