import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChatMessage } from './chat-message.entity';

export enum ChatStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('int', { name: 'user1_id' })
  user1Id: number;

  @Column('int', { name: 'user2_id' })
  user2Id: number;

  @Column('varchar', { length: 255, name: 'subject', nullable: true })
  subject?: string;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.ACTIVE,
  })
  status: ChatStatus;

  @Column('int', { name: 'unread_user1', default: 0 })
  unreadUser1: number;

  @Column('int', { name: 'unread_user2', default: 0 })
  unreadUser2: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1_id' })
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2_id' })
  user2: User;

  @OneToMany(() => ChatMessage, (message) => message.chat)
  messages: ChatMessage[];
}
