import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole, UserStatus } from '../../../common/enums';

@Entity('users')
@Index(['email'])
@Index(['phone'])
@Index(['role'])
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'first_name', length: 100 })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 100 })
  lastName: string;

  @Column('varchar', { unique: true, length: 255 })
  email: string;

  @Column('varchar', { nullable: true, unique: true, length: 20 })
  phone?: string;

  @Column('varchar', { nullable: true, select: false })
  password?: string;

  @Column('varchar', { name: 'profile_picture', nullable: true, length: 500 })
  profilePicture?: string;

  // Role & Status
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  // Verification
  @Column('boolean', { name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column('boolean', { name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column('boolean', { name: 'identity_verified', default: false })
  identityVerified: boolean;

  @Column('varchar', { name: 'verification_token', nullable: true, length: 255 })
  verificationToken?: string;

  @Column('timestamp', { name: 'verification_token_expires', nullable: true })
  verificationTokenExpires?: Date;

  // Password Reset
  @Column('varchar', { name: 'reset_password_otp', nullable: true, length: 10 })
  resetPasswordOtp?: string;

  @Column('timestamp', { name: 'reset_password_otp_expires', nullable: true })
  resetPasswordOtpExpires?: Date;

  @Column('timestamp', { name: 'last_login', nullable: true })
  lastLogin?: Date;

  // Soft Delete
  @Exclude()
  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Timestamps
  @Exclude()
  @CreateDateColumn({ 
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToOne('UserMeta', 'user', { cascade: true, eager: true })
  meta?: any;

  @OneToMany('UserAuthProvider', 'user', { cascade: true, eager: false })
  authProviders?: any[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isVerified(): boolean {
    return this.emailVerified && this.identityVerified;
  }

  get canManageProperties(): boolean {
    return [
      UserRole.ADMIN,
      UserRole.AGENT,
    ].includes(this.role);
  }

  get canSellInMarketplace(): boolean {
    return this.meta?.isVendor && this.meta?.vendorVerified && this.status === UserStatus.ACTIVE;
  }

  get canProvideProfessionalServices(): boolean {
    return this.role === UserRole.AGENT && this.identityVerified;
  }
  
  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
  
  // Helper to check if user has a specific auth provider linked
  hasAuthProvider(provider: string): boolean {
    return this.authProviders?.some(ap => ap.provider === provider) ?? false;
  }
}