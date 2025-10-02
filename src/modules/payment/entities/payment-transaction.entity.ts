import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { length: 255, name: 'reference', unique: true })
  @Index()
  reference: string;

  @Column('varchar', { length: 50, name: 'payment_type' })
  paymentType: string; // 'inspection', 'consultation', 'order'

  @Column('bigint', { name: 'entity_id', unsigned: true })
  entityId: number; // ID of the inspection, consultation, or order

  @Column('bigint', { name: 'user_id', unsigned: true })
  userId: number;

  @Column('decimal', { name: 'amount', precision: 12, scale: 2 })
  amount: number; // Amount in base currency (Naira)

  @Column('int', { name: 'amount_kobo' })
  amountKobo: number; // Amount in smallest unit (kobo/cents)

  @Column('varchar', { length: 10, name: 'currency', default: 'NGN' })
  currency: string;

  @Column('varchar', { length: 50, name: 'status', default: 'pending' })
  @Index()
  status: string; // 'pending', 'success', 'failed', 'cancelled'

  @Column('varchar', { length: 50, name: 'payment_provider' })
  paymentProvider: string; // 'paystack', 'flutterwave'

  @Column('varchar', { length: 255, name: 'authorization_url', nullable: true })
  authorizationUrl?: string;

  @Column('varchar', { length: 255, name: 'access_code', nullable: true })
  accessCode?: string;

  @Column('varchar', { length: 255, name: 'customer_email' })
  customerEmail: string;

  @Column('varchar', { length: 255, name: 'customer_name', nullable: true })
  customerName?: string;

  @Column('varchar', { length: 50, name: 'customer_phone', nullable: true })
  customerPhone?: string;

  @Column('json', { name: 'metadata', nullable: true })
  metadata?: Record<string, any>;

  @Column('json', { name: 'provider_response', nullable: true })
  providerResponse?: Record<string, any>;

  @Column('timestamp', { name: 'paid_at', nullable: true })
  paidAt?: Date;

  @Exclude()


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()


  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
