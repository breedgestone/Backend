import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint', { name: 'order_id', unsigned: true })
  orderId: number;

  @Column('bigint', { name: 'product_id', unsigned: true })
  productId: number;

  @Column('bigint', { name: 'variation_id', unsigned: true, nullable: true })
  variationId?: number;

  @Column('int', { name: 'quantity' })
  quantity: number;

  @Column('decimal', { name: 'price', precision: 20, scale: 2 })
  price: number;

  @Column('decimal', { name: 'total', precision: 20, scale: 2 })
  total: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
