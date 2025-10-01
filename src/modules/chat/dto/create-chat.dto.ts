import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    example: 2,
    description: 'The user ID to start chat with',
    type: Number,
  })
  @IsNumber()
  recipientId: number;

  @ApiPropertyOptional({
    example: 'Product inquiry',
    description: 'Optional chat subject',
    type: String,
  })
  @IsOptional()
  @IsString()
  subject?: string;
}

export class SendMessageDto {
  @ApiProperty({
    example: 1,
    description: 'Chat ID',
    type: Number,
  })
  @IsNumber()
  chatId: number;

  @ApiProperty({
    example: 'Hello, I need help with my order',
    description: 'Message content',
    type: String,
  })
  @IsString()
  message: string;
}
