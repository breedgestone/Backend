import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsObject,
} from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty({
    description: 'Customer email address',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Amount to charge in smallest currency unit (kobo for NGN, cents for USD)',
    example: 50000,
    minimum: 100,
  })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'NGN',
    required: false,
    default: 'NGN',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Unique payment reference',
    example: 'PAY_1234567890_ABC',
    required: false,
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({
    description: 'Callback URL for payment redirect',
    example: 'https://yoursite.com/payment/callback',
    required: false,
  })
  @IsString()
  @IsOptional()
  callbackUrl?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { orderId: 123, userId: 456 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+2348012345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
