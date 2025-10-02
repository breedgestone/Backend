import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, LoginUserDto, OAuthUserDto } from './dto';
import { User, UserMeta, UserAuthProvider } from './entities';
import { OAuthProvider } from '../../common/enums';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserMeta)
    private userMetaRepository: Repository<UserMeta>,
    @InjectRepository(UserAuthProvider)
    private authProviderRepository: Repository<UserAuthProvider>,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create user
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });

    // Save user first to get the ID
    const savedUser = await this.usersRepository.save(user);

    // Create user meta with additional information
    const userMeta = this.userMetaRepository.create({
      userId: savedUser.id,
      gender: createUserDto.gender,
      bio: createUserDto.bio,
      address: createUserDto.address,
      city: createUserDto.city,
      state: createUserDto.state,
      country: createUserDto.country,
    });

    savedUser.meta = await this.userMetaRepository.save(userMeta);
    
    return savedUser;
  }

  async findOrCreateOAuthUser(oauthUser: OAuthUserDto): Promise<User> {
    // Try to find existing auth provider link
    const existingAuthProvider = await this.authProviderRepository.findOne({
      where: { 
        provider: oauthUser.oauthProvider as OAuthProvider,
        providerId: oauthUser.oauthId 
      },
      relations: ['user', 'user.meta'],
    });

    if (existingAuthProvider) {
      return existingAuthProvider.user;
    }

    // Try to find user by email (user might have registered with email/password or different OAuth)
    let user = await this.usersRepository.findOne({
      where: { email: oauthUser.email },
      relations: ['authProviders'],
    });

    if (user) {
      // Link new OAuth provider to existing user
      const authProvider = this.authProviderRepository.create({
        userId: user.id,
        provider: oauthUser.oauthProvider as OAuthProvider,
        providerId: oauthUser.oauthId,
        metadata: {
          firstName: oauthUser.firstName,
          lastName: oauthUser.lastName,
        },
      });
      
      await this.authProviderRepository.save(authProvider);
      user.emailVerified = true; // OAuth accounts are email verified
      return await this.usersRepository.save(user);
    }

    // Create new user with OAuth
    const newUser = this.usersRepository.create({
      email: oauthUser.email,
      firstName: oauthUser.firstName || 'User',
      lastName: oauthUser.lastName || '',
      emailVerified: true, // OAuth accounts are email verified
      status: 'active' as any, // Activate OAuth users immediately
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Create default user meta
    const userMeta = this.userMetaRepository.create({
      userId: savedUser.id,
    });
    await this.userMetaRepository.save(userMeta);

    // Create auth provider link
    const authProvider = this.authProviderRepository.create({
      userId: savedUser.id,
      provider: oauthUser.oauthProvider as OAuthProvider,
      providerId: oauthUser.oauthId,
      metadata: {
        firstName: oauthUser.firstName,
        lastName: oauthUser.lastName,
      },
    });
    await this.authProviderRepository.save(authProvider);

    // Reload user with relations
    const reloadedUser = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['meta', 'authProviders'],
    });
    
    if (!reloadedUser) {
      throw new Error('Failed to create user');
    }
    
    return reloadedUser;
  }

  async linkAuthProvider(userId: number, provider: OAuthProvider, providerId: string, metadata?: Record<string, any>): Promise<UserAuthProvider> {
    // Check if this provider is already linked
    const existing = await this.authProviderRepository.findOne({
      where: { userId, provider }
    });
    
    if (existing) {
      throw new ConflictException(`${provider} is already linked to this account`);
    }
    
    // Create new auth provider link
    const authProvider = this.authProviderRepository.create({
      userId,
      provider,
      providerId,
      metadata,
    });
    
    return await this.authProviderRepository.save(authProvider);
  }

  async unlinkAuthProvider(userId: number, provider: OAuthProvider): Promise<void> {
    // Don't allow unlinking if it's the only auth method and user has no password
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['authProviders'],
      select: ['id', 'password'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const providerCount = user.authProviders?.length || 0;
    
    if (providerCount <= 1 && !user.password) {
      throw new BadRequestException('Cannot unlink the only authentication method. Please set a password first or link another provider.');
    }
    
    await this.authProviderRepository.delete({ userId, provider });
  }

  async getUserAuthProviders(userId: number): Promise<UserAuthProvider[]> {
    return await this.authProviderRepository.find({
      where: { userId },
      order: { linkedAt: 'ASC' },
    });
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const query = this.usersRepository.createQueryBuilder('user')
      .where('user.email = :email', { email });
    
    if (includePassword) {
      query.addSelect('user.password');
    }
    
    return await query.getOne();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'profilePicture', 'emailVerified', 'phoneVerified', 'identityVerified'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.findByEmail(loginUserDto.email);
    if (!user) {
      return null;
    }

    if (!user.password) {
      throw new BadRequestException('Please login using your social account');
    }

    const isPasswordValid = await this.verifyPassword(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async requestPasswordReset(email: string, otp: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpExpiresIn = this.configService.get<number>('otp.expiresIn', 600);
    const otpExpires = new Date();
    otpExpires.setSeconds(otpExpires.getSeconds() + otpExpiresIn);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;

    await this.usersRepository.save(user);

    // Send OTP email (non-blocking)
    this.notificationService.sendNotification({
      to: user.email,
      subject: 'Your Password Reset OTP',
      html: `Your OTP is: <b>${otp}</b>. It will expire in ${otpExpiresIn / 60} minutes.`,
    });
  }

  async confirmPasswordReset(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      throw new BadRequestException('No password reset request found');
    }

    const now = new Date();
    if (now > user.resetPasswordOtpExpires) {
      throw new BadRequestException('OTP has expired');
    }

    if (user.resetPasswordOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Update password and clear OTP
    user.password = await this.hashPassword(newPassword);
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await this.usersRepository.save(user);
  }

  // ========================================
  // Change Password (Authenticated users)
  // ========================================
  
  /**
   * Change password for authenticated user (requires current password)
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password'],
    });
    
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    
    if (!user.password) {
      throw new BadRequestException('No password set. Please set a password first or use password reset.');
    }

    const isPasswordValid = await this.verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await this.hashPassword(newPassword);
    await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Update only the fields that are provided
    Object.assign(user, updateUserDto);
    
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
