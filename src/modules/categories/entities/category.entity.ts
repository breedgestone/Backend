import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CategorySub } from './category-sub.entity';

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
  @OneToMany(() => CategorySub, (categorySub) => categorySub.category)
  categorySubs: CategorySub[];
}
