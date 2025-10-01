import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { Chat, ChatMessage } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMessage]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}
