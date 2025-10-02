import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    example: 1,
    description: 'Product ID to add to cart',
    type: Number,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of product',
    type: Number,
  })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'SubCategory ID (if applicable)',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  subCategoryId?: number;
}
