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
import { User } from '../../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId?: number;

  @Column('varchar', { length: 255, name: 'order_number', unique: true })
  orderNumber: string;

  @Column('decimal', { name: 'total_amount', precision: 8, scale: 2, default: 0 })
  totalAmount: number;

  @Column('varchar', { length: 255, name: 'payment_method', nullable: true })
  paymentMethod?: string;

  @Column('varchar', { length: 255, name: 'payment_status', nullable: true })
  paymentStatus?: string;

  @Column('varchar', { length: 255, name: 'status', default: 'pending' })
  status: string;

  @Column('varchar', { length: 255, name: 'delivery_address', nullable: true })
  deliveryAddress?: string;

  @Column('decimal', { name: 'delivery_fee', precision: 8, scale: 2, nullable: true, default: 0 })
  deliveryFee?: number;

  @Column('decimal', { name: 'tax', precision: 8, scale: 2, nullable: true, default: 0 })
  tax?: number;

  @Column('text', { name: 'note', nullable: true })
  note?: string;

  @Column('bigint', { name: 'guest_id', unsigned: true, nullable: true })
  guestId?: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
