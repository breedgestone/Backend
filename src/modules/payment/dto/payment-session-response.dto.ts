import { ApiProperty } from '@nestjs/swagger';

/**
 * Response from payment session creation
 * Contains everything the frontend needs to redirect user to payment
 */
export class PaymentSessionResponse {
  @ApiProperty({
    description: 'Unique payment reference',
    example: 'PAY_INSP_123_1234567890',
  })
  reference: string;

  @ApiProperty({
    description: 'Payment authorization URL to redirect user',
    example: 'https://checkout.paystack.com/abc123',
  })
  authorizationUrl: string;

  @ApiProperty({
    description: 'Access code for the payment (provider-specific)',
    example: 'abc123xyz',
    required: false,
  })
  accessCode?: string;

  @ApiProperty({
    description: 'Amount in smallest currency unit (kobo/cents)',
    example: 500000,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'NGN',
  })
  currency: string;

  @ApiProperty({
    description: 'Payment provider being used',
    example: 'paystack',
  })
  provider: string;
}

/**
 * Response from payment verification
 */
export class PaymentVerificationResponse {
  @ApiProperty({
    description: 'Whether payment was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Payment reference',
    example: 'PAY_INSP_123_1234567890',
  })
  reference: string;

  @ApiProperty({
    description: 'Amount paid in smallest currency unit',
    example: 500000,
  })
  amount: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Entity ID that was paid for',
    example: 123,
  })
  entityId: number;

  @ApiProperty({
    description: 'Type of entity paid for',
    example: 'inspection',
  })
  entityType: string;

  @ApiProperty({
    description: 'Timestamp when payment was completed',
  })
  paidAt?: Date;
}
