import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 3,
    description: 'New quantity for cart item',
    type: Number,
  })
  @IsNumber()
  quantity: number;
}
