import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendPushDto {
  @ApiProperty({
    example: 'fcm_device_token_here',
    description: 'FCM device token',
  })
  @IsString()
  deviceToken: string;

  @ApiProperty({
    example: 'New Order',
    description: 'Push notification title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'You have a new order from John Doe',
    description: 'Push notification body',
  })
  @IsString()
  body: string;

  @ApiPropertyOptional({
    example: { orderId: '123', type: 'order' },
    description: 'Additional data payload',
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}
