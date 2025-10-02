import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

@Entity('user_meta')
@Index(['userId'])
@Index(['city'])
@Index(['country'])
export class UserMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @OneToOne(() => User, (user) => user.meta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Profile Information
  @Column('varchar', { nullable: true, length: 10 })
  gender?: string; // male, female, other

  @Column('date', { name: 'date_of_birth', nullable: true })
  dateOfBirth?: Date;

  @Column('text', { nullable: true })
  bio?: string;

  // Address Information
  @Column('varchar', { nullable: true, length: 255 })
  address?: string;

  @Column('varchar', { nullable: true, length: 100 })
  city?: string;

  @Column('varchar', { nullable: true, length: 100 })
  state?: string;

  @Column('varchar', { nullable: true, length: 100 })
  country?: string;

  @Column('varchar', { name: 'fcm_token', nullable: true, length: 500 })
  fcmToken?: string; // Firebase Cloud Messaging token

  @Column('timestamp', { name: 'last_seen', nullable: true })
  lastSeen?: Date;
}
