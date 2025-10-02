import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsOptional, Min, IsEnum } from 'class-validator';

export enum PaymentType {
  INSPECTION = 'inspection',
  CONSULTATION = 'consultation',
  ORDER = 'order',
}

/**
 * DTO for creating a payment session
 * Payment module handles all the complexity internally
 */
export class CreatePaymentSessionDto {
  @ApiProperty({
    description: 'Type of payment',
    enum: PaymentType,
    example: PaymentType.ORDER,
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({
    description: 'ID of the entity being paid for (inspection, consultation, or order)',
    example: 123,
  })
  @IsNumber()
  entityId: number;

  @ApiProperty({
    description: 'User ID making the payment',
    example: 456,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Amount in base currency (e.g., Naira, not kobo)',
    example: 5000,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

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

  @ApiProperty({
    description: 'Additional metadata',
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
