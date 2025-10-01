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
import { CategorySub } from './category-sub.entity';
import { Asset } from '../../../common/entities';

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Asset, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset;

  @OneToMany(() => CategorySub, (categorySub) => categorySub.category)
  categorySubs: CategorySub[];
}
