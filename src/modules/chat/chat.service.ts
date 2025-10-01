import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatDto, SendMessageDto, UpdateChatDto } from './dto';
import { ChatStatus } from '../../common/enums';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}

  // Create a new chat between two users
  async createChat(senderId: number, createChatDto: CreateChatDto): Promise<Chat> {
    const { recipientId, subject } = createChatDto;

    if (senderId === recipientId) {
      throw new BadRequestException('Cannot create chat with yourself');
    }

    // Check if chat already exists between these two users
    const existingChat = await this.chatRepository
      .createQueryBuilder('chat')
      .where(
        '((chat.user1Id = :senderId AND chat.user2Id = :recipientId) OR (chat.user1Id = :recipientId AND chat.user2Id = :senderId))',
        { senderId, recipientId },
      )
      .andWhere('chat.deletedAt IS NULL')
      .getOne();

    if (existingChat) {
      return existingChat;
    }

    const chat = this.chatRepository.create({
      user1Id: senderId,
      user2Id: recipientId,
      subject,
      status: ChatStatus.ACTIVE,
    });

    return await this.chatRepository.save(chat);
  }

  // Send a message in a chat
  async sendMessage(senderId: number, sendMessageDto: SendMessageDto): Promise<ChatMessage> {
    const { chatId, message } = sendMessageDto;

    const chat = await this.chatRepository.findOne({
      where: { id: chatId, deletedAt: IsNull() },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if sender is part of this chat
    if (chat.user1Id !== senderId && chat.user2Id !== senderId) {
      throw new ForbiddenException('You are not part of this chat');
    }

    // Create the message
    const chatMessage = this.chatMessageRepository.create({
      chatId,
      senderId,
      message,
    });

    const savedMessage = await this.chatMessageRepository.save(chatMessage);

    // Update unread counter for the recipient
    if (senderId === chat.user1Id) {
      chat.unreadUser2 += 1;
    } else {
      chat.unreadUser1 += 1;
    }

    chat.updatedAt = new Date();
    await this.chatRepository.save(chat);

    return savedMessage;
  }

    // Get all chats for a user
  async getUserChats(userId: number): Promise<Chat[]> {
    return await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.user1', 'user1')
      .leftJoinAndSelect('chat.user2', 'user2')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where('(chat.user1Id = :userId OR chat.user2Id = :userId)', { userId })
      .andWhere('chat.deletedAt IS NULL')
      .orderBy('chat.updatedAt', 'DESC')
      .getMany();
  }

  // Get a specific chat by ID
  async findChatById(chatId: number, userId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId, deletedAt: IsNull() },
      relations: ['user1', 'user2', 'messages', 'messages.sender'],
      order: { messages: { createdAt: 'ASC' } },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user has access to this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return chat;
  }

  // Get messages for a chat
  async getChatMessages(chatId: number, userId: number): Promise<ChatMessage[]> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId, deletedAt: IsNull() },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user has access to this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    return await this.chatMessageRepository.find({
      where: { chatId, deletedAt: IsNull() },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  // Mark messages as read
  async markMessagesAsRead(chatId: number, userId: number): Promise<void> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user has access to this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    // Update unread counter for this user
    if (userId === chat.user1Id) {
      chat.unreadUser1 = 0;
    } else {
      chat.unreadUser2 = 0;
    }

    // Mark messages sent by the other user as read
    const otherUserId = userId === chat.user1Id ? chat.user2Id : chat.user1Id;
    await this.chatMessageRepository.update(
      { chatId, senderId: otherUserId, isRead: false },
      { isRead: true },
    );

    await this.chatRepository.save(chat);
  }

  // Update chat status
  async updateChatStatus(chatId: number, userId: number, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user has access to this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    if (updateChatDto.status) {
      chat.status = updateChatDto.status;
    }
    return await this.chatRepository.save(chat);
  }

  // Close a chat
  async closeChat(chatId: number, userId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user has access to this chat
    if (chat.user1Id !== userId && chat.user2Id !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    chat.status = ChatStatus.CLOSED;
    return await this.chatRepository.save(chat);
  }

  // Helper: Get the other user in a chat
  getOtherUserId(chat: Chat, currentUserId: number): number {
    return chat.user1Id === currentUserId ? chat.user2Id : chat.user1Id;
  }

  // Helper: Get unread count for a user in a chat
  getUnreadCount(chat: Chat, userId: number): number {
    return chat.user1Id === userId ? chat.unreadUser1 : chat.unreadUser2;
  }
}
