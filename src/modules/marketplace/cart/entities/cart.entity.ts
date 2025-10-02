import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../../users/entities/user.entity';
import { CartProduct } from './cart-product.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId?: number;

  @Column('bigint', { name: 'guest_id', unsigned: true, nullable: true })
  guestId?: number;

  @Exclude()


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()


  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProducts: CartProduct[];
}
