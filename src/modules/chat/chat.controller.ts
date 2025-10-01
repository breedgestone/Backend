import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto, UpdateChatDto, SendMessageDto } from './dto';
import { Chat, ChatMessage } from './entities';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat with another user' })
  @ApiResponse({ status: 201, description: 'Chat created successfully', type: Chat })
  async createChat(@Request() req, @Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatService.createChat(req.user.id, createChatDto);
  }

  @Post(':id/message')
  @ApiOperation({ summary: 'Send a message in a chat' })
  @ApiResponse({ status: 201, description: 'Message sent successfully', type: ChatMessage })
  async sendMessage(
    @Request() req,
    @Param('id', ParseIntPipe) chatId: number,
    @Body() body: { message: string },
  ): Promise<ChatMessage> {
    return this.chatService.sendMessage(req.user.id, { chatId, message: body.message });
  }

  @Get('my-chats')
  @ApiOperation({ summary: 'Get all chats for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Chats retrieved successfully', type: [Chat] })
  async getMyChats(@Request() req): Promise<Chat[]> {
    return this.chatService.getUserChats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific chat by ID' })
  @ApiResponse({ status: 200, description: 'Chat retrieved successfully', type: Chat })
  async getChat(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Chat> {
    return this.chatService.findChatById(id, req.user.id);
  }

    @Get(':id/messages')
  @ApiOperation({ summary: 'Get all messages in a chat' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: [ChatMessage] })
  async getChatMessages(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<ChatMessage[]> {
    return this.chatService.getChatMessages(id, req.user.id);
  }

  @Post(':id/mark-read')
  @ApiOperation({ summary: 'Mark all messages in a chat as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markAsRead(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.chatService.markMessagesAsRead(id, req.user.id);
    return { message: 'Messages marked as read' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chat status' })
  @ApiResponse({ status: 200, description: 'Chat updated successfully', type: Chat })
  async updateChat(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatDto: UpdateChatDto,
  ): Promise<Chat> {
    return this.chatService.updateChatStatus(id, req.user.id, updateChatDto);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close a chat' })
  @ApiResponse({ status: 200, description: 'Chat closed successfully', type: Chat })
  async closeChat(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Chat> {
    return this.chatService.closeChat(id, req.user.id);
  }
}
