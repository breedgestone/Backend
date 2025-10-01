import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure this for production
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Store connected users: userId -> socketId
  private connectedUsers = new Map<number, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    
    // Get user ID from handshake query or auth token
    const userId = client.handshake.query.userId as string;
    
    if (userId) {
      this.connectedUsers.set(parseInt(userId), client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Remove user from connected users
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { senderId: number; message: SendMessageDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Save message to database
      const savedMessage = await this.chatService.sendMessage(
        data.senderId,
        data.message,
      );

      // Broadcast to chat room EXCEPT the sender (they already have it in UI)
      // client.broadcast.to() sends to everyone in the room EXCEPT the sender
      client.broadcast.to(`chat_${data.message.chatId}`).emit('new_message', {
        message: savedMessage,
        chatId: data.message.chatId,
        senderId: data.senderId,
      });

      return { success: true, message: savedMessage };
    } catch (error) {
      client.emit('message_error', {
        success: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: { chatId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Verify user has access to this chat
      const chat = await this.chatService.findChatById(data.chatId, data.userId);
      
      // If findChatById succeeds, user has access (it throws ForbiddenException otherwise)
      
      // Join the chat room
      client.join(`chat_${data.chatId}`);
      
      console.log(`User ${data.userId} joined chat ${data.chatId}`);
      
      client.emit('joined_chat', {
        success: true,
        chatId: data.chatId,
      });

      return { success: true, chatId: data.chatId };
    } catch (error) {
      client.emit('join_chat_error', {
        success: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('leave_chat')
  handleLeaveChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`chat_${data.chatId}`);
    console.log(`Client ${client.id} left chat ${data.chatId}`);
    
    client.emit('left_chat', {
      success: true,
      chatId: data.chatId,
    });

    return { success: true };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { chatId: number; userId: number; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast typing indicator to others in the chat
    client.to(`chat_${data.chatId}`).emit('user_typing', {
      chatId: data.chatId,
      userId: data.userId,
      isTyping: data.isTyping,
    });

    return { success: true };
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: { chatId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.chatId, data.userId);
      
      // Notify others that messages were read
      client.to(`chat_${data.chatId}`).emit('messages_read', {
        chatId: data.chatId,
        userId: data.userId,
      });

      client.emit('marked_read', {
        success: true,
        chatId: data.chatId,
      });

      return { success: true };
    } catch (error) {
      client.emit('mark_read_error', {
        success: false,
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  }

  // Helper method to emit to specific user
  emitToUser(userId: number, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  // Helper method to emit to chat room
  emitToChat(chatId: number, event: string, data: any) {
    this.server.to(`chat_${chatId}`).emit(event, data);
  }
}
