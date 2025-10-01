import { IsString, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'Product ID',
    type: Number,
  })
  @IsNumber()
  productId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Product variation ID (if applicable)',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  variationId?: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity to order',
    type: Number,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 5500,
    description: 'Price per unit',
    type: Number,
  })
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Main Street, Lagos, Nigeria',
    description: 'Delivery address',
  })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({
    example: [{ productId: 1, quantity: 2, price: 5500 }],
    description: 'Order items',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({
    example: 'card',
    description: 'Payment method (card, bank_transfer, cash_on_delivery)',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    example: 1500,
    description: 'Delivery fee amount',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @ApiPropertyOptional({
    example: 750,
    description: 'Tax amount',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  tax?: number;

  @ApiPropertyOptional({
    example: 'Please deliver between 9AM-5PM',
    description: 'Order notes',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
