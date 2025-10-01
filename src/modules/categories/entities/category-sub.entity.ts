import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { SubCategory } from './sub-category.entity';

@Entity('category_subs')
export class CategorySub {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint', { name: 'category_id', unsigned: true })
  categoryId: number;

  @Column('bigint', { name: 'sub_category_id', unsigned: true })
  subCategoryId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, (category) => category.categorySubs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.categorySubs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;
}
