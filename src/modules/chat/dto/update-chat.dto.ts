import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChatStatus } from '../entities/chat.entity';

export class UpdateChatDto {
  @ApiPropertyOptional({
    example: 'closed',
    description: 'Chat status',
    enum: ChatStatus,
  })
  @IsOptional()
  @IsEnum(ChatStatus)
  status?: ChatStatus;
}
