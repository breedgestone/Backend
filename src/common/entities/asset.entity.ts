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
import { Exclude } from 'class-transformer';
import { AssetType } from '../enums';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint', { name: 'property_id', nullable: true, unsigned: true })
  propertyId?: number;

  @Column('bigint', { name: 'product_id', nullable: true, unsigned: true })
  productId?: number;

  @Column('varchar', { length: 500, name: 'path' })
  path: string; // S3 URL or path

  @Column('varchar', { length: 255, name: 'code', unique: true, nullable: true })
  code?: string; // Unique identifier for the asset

  @Column('varchar', {
    name: 'type',
    length: 50,
    default: `'${AssetType.GALLERY}'`,
  })
  type: AssetType;

  @Column('int', { name: 'order', default: 0 })
  order: number; // For sorting assets

  @Column('varchar', { length: 255, name: 'alt_text', nullable: true })
  altText?: string;

  @Exclude()


  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Exclude()


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()


  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations (optional - only loaded when needed)
  @ManyToOne('Property', 'assets', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property?: any;

  @ManyToOne('Product', 'assets', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product?: any;
}
