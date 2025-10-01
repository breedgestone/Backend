import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { OAuthProvider } from '../../../common/enums';
import { User } from './user.entity';

@Entity('user_auth_providers')
@Unique(['provider', 'providerId'])
@Index(['userId'])
@Index(['provider'])
export class UserAuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: OAuthProvider,
    name: 'provider',
  })
  provider: OAuthProvider;

  @Column('varchar', { name: 'provider_id', nullable: true, length: 255 })
  providerId?: string;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @Column('timestamp', { name: 'linked_at', default: () => 'CURRENT_TIMESTAMP' })
  linkedAt: Date;

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  // Relationship
  @ManyToOne('User', 'authProviders', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
