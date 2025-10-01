import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'Sub-category ID',
    type: Number,
  })
  @IsNumber()
  subCategoryId: number;

  @ApiProperty({
    example: 'Premium Cement',
    description: 'Product name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'High-quality cement for construction projects',
    description: 'Product description',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 5500,
    description: 'Product price',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 'per bag',
    description: 'Price unit (e.g., per bag, per ton)',
  })
  @IsOptional()
  @IsString()
  priceUnit?: string;

  @ApiPropertyOptional({
    example: 'img_123456',
    description: 'Product image ID',
  })
  @IsOptional()
  @IsString()
  imageId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Product status (1=active, 0=inactive)',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}
