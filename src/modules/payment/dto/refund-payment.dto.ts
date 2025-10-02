import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty({
    description: 'Payment reference to refund',
    example: 'PAY_1234567890_ABC',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Amount to refund in smallest currency unit (optional for partial refund)',
    example: 25000,
    minimum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(100)
  amount?: number;

  @ApiProperty({
    description: 'Reason for refund',
    example: 'Customer requested refund',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
