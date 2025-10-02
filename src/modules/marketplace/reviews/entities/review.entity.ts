import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { ReviewableType } from '../../../../common/enums';

/**
 * Review Entity
 * 
 * Polymorphic reviews - users can review products, properties, or agents
 * Uses reviewable_type and reviewable_id to identify what's being reviewed
 */
@Entity('reviews')
@Index(['reviewable_type', 'reviewable_id'])
@Index(['user_id'])
@Index(['rating'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  // Polymorphic relationship fields
  @Column({
    type: 'varchar',
    length: 20,
    comment: 'Type of entity being reviewed (product, property, or agent)',
  })
  @Index()
  reviewable_type: ReviewableType;

  @Column({
    type: 'int',
    comment: 'ID of the entity being reviewed',
  })
  reviewable_id: number;

  // Reviewer
  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Review content
  @Column({ type: 'int', comment: 'Rating from 1-5 stars' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  // Additional fields
  @Column({ type: 'boolean', default: true })
  is_verified: boolean; // Can be set if user actually purchased/used the service

  @Column({ type: 'boolean', default: true })
  is_active: boolean; // Can be deactivated by admin if inappropriate

  // Timestamps
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
