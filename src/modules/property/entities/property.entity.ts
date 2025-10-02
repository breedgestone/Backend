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
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { PropertyStatus, PropertyType, FurnishingType, PropertySize } from '../../../common/enums';
import { Asset } from '../../../common/entities';
import { PropertyFee } from './property-fee.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('int', { name: 'agent_id' })
  agentId: number;

  @Column('varchar', { length: 255, name: 'title' })
  title: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('varchar', {
    name: 'type',
    length: 50,
  })
  type: PropertyType;

  @Column('decimal', { name: 'price', precision: 15, scale: 2 })
  price: number;

  @Column('varchar', { length: 500, name: 'address' })
  address: string;

  @Column('varchar', { length: 100, name: 'city' })
  city: string;

  @Column('varchar', { length: 100, name: 'state' })
  state: string;

  @Column('varchar', { length: 20, name: 'country', default: "'Nigeria'" })
  country: string;

  @Column('int', { name: 'bedrooms', nullable: true })
  bedrooms?: number;

  @Column('int', { name: 'bathrooms', nullable: true })
  bathrooms?: number;

  @Column('decimal', { name: 'area_sqm', precision: 10, scale: 2, nullable: true })
  areaSqm?: number;

  @Column('varchar', {
    name: 'property_size',
    length: 50,
    nullable: true,
  })
  propertySize?: PropertySize;

  @Column('varchar', {
    name: 'furnishing',
    length: 50,
    nullable: true,
  })
  furnishing?: FurnishingType;

  @Column('simple-array', { name: 'amenities', nullable: true })
  amenities?: string[];

  @Column('varchar', {
    name: 'status',
    length: 50,
    default: `'${PropertyStatus.DRAFT}'`,
  })
  status: PropertyStatus;

  @Column('timestamp', { name: 'approved_at', nullable: true })
  approvedAt?: Date;

  @Column('text', { name: 'rejection_reason', nullable: true })
  rejectionReason?: string;

  @Column('int', { name: 'views', default: 0 })
  views: number;

  @Column('boolean', { name: 'is_featured', default: false })
  isFeatured: boolean;

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
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @OneToMany(() => Asset, (asset) => asset.property, { cascade: true })
  assets: Asset[];

  @OneToMany(() => PropertyFee, (fee) => fee.property, { cascade: true })
  fees: PropertyFee[];
}
