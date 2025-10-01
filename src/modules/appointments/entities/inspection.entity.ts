import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../property/entities/property.entity';
import { AppointmentStatus } from '../../../common/enums';

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column('bigint', { name: 'property_id', unsigned: true })
  propertyId: number;

  @Column('int', { name: 'agent_id' })
  agentId: number;

  @Column('varchar', { length: 100, name: 'first_name' })
  firstName: string;

  @Column('varchar', { length: 100, name: 'last_name' })
  lastName: string;

  @Column('varchar', { length: 255, name: 'email' })
  email: string;

  @Column('varchar', { length: 20, name: 'phone' })
  phone: string;

  @Column('timestamp', { name: 'preferred_date_time' })
  preferredDateTime: Date;

  @Column('text', { name: 'message', nullable: true })
  message?: string;

  @Column('decimal', { name: 'amount', precision: 15, scale: 2 })
  amount: number;

  @Column('varchar', { length: 255, name: 'payment_reference', nullable: true })
  paymentReference?: string; // Reference to payment transaction

  @Column('varchar', {
    name: 'status',
    length: 50,
    default: `'${AppointmentStatus.PENDING}'`,
  })
  status: AppointmentStatus;

  @Column('timestamp', { name: 'scheduled_at', nullable: true })
  scheduledAt?: Date;

  @Column('timestamp', { name: 'confirmed_at', nullable: true })
  confirmedAt?: Date;

  @Column('timestamp', { name: 'completed_at', nullable: true })
  completedAt?: Date;

  @Column('timestamp', { name: 'cancelled_at', nullable: true })
  cancelledAt?: Date;

  @Column('text', { name: 'cancellation_reason', nullable: true })
  cancellationReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agent_id' })
  agent: User;
}
