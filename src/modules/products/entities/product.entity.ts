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
import { SubCategory } from '../../categories/entities/sub-category.entity';
import { CartProduct } from '../../cart/entities/cart-product.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint', { name: 'sub_category_id', unsigned: true })
  subCategoryId: number;

  @Column('varchar', { length: 255, name: 'name' })
  name: string;

  @Column('varchar', { length: 255, name: 'description' })
  description: string;

  @Column('decimal', { name: 'price', precision: 12, scale: 2, nullable: true })
  price?: number;

  @Column('varchar', { length: 255, name: 'price_unit', nullable: true })
  priceUnit?: string;

  @Column('varchar', { length: 255, name: 'image_id', nullable: true })
  imageId?: string;

  @Column('tinyint', { name: 'status', default: 1 })
  status: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
