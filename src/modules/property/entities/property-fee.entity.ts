import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_fees')
export class PropertyFee {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint', { name: 'property_id', unsigned: true })
  propertyId: number;

  @Column('varchar', { length: 255, name: 'fee_category' })
  feeCategory: string; // e.g., "Additional Fees (One-time, upfront)"

  @Column('varchar', { length: 255, name: 'fee_name' })
  feeName: string; // e.g., "Caution Deposit"

  @Column('text', { name: 'purpose' })
  purpose: string; // e.g., "Security for Property Damages"

  @Column('decimal', { name: 'price', precision: 15, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Property, (property) => property.fees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;
}
