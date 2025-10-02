import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_product')
export class CartProduct {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint', { name: 'cart_id', unsigned: true })
  cartId: number;

  @Column('bigint', { name: 'product_id', unsigned: true })
  productId: number;

  @Column('bigint', { name: 'sub_category_id', unsigned: true, nullable: true })
  subCategoryId?: number;

  @Column('int', { name: 'quantity', default: 1 })
  quantity: number;

  @Exclude()


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()


  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Cart, (cart) => cart.cartProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
