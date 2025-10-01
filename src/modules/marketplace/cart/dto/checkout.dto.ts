import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutDto {
  @ApiProperty({
    example: '123 Main Street, Lagos, Nigeria',
    description: 'Delivery address for the order',
    type: String,
  })
  @IsString()
  deliveryAddress: string;

  @ApiPropertyOptional({
    example: 'card',
    description: 'Payment method (card, bank_transfer, cash_on_delivery)',
    type: String,
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
    example: 'Please deliver before 5pm',
    description: 'Additional notes for the order',
    type: String,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
