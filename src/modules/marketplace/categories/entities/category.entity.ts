import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { CategorySub } from './category-sub.entity';
import { SubCategory } from './sub-category.entity';
import { Asset } from '../../../../common/entities';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { length: 255, name: 'name' })
  name: string;

  @Column('varchar', { length: 255, name: 'slug', unique: true })
  slug: string;

  @Column('text', { name: 'description', nullable: true })
  description?: string;

  @Column('bigint', { name: 'asset_id', unsigned: true, nullable: true })
  assetId?: number;

  @Column('tinyint', { name: 'status', default: 1 })
  status: number;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Asset, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset;

  @Exclude()
  @OneToMany(() => CategorySub, (categorySub) => categorySub.category)
  categorySubs: CategorySub[];

  // Virtual property: Direct access to subcategories (skipping junction table)
  subCategories?: SubCategory[];
}
