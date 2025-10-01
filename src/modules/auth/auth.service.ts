import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '../users/dto';
import { User } from '../users/entities';
import { NotificationService } from '../notification/notification.service';
import * as bcrypt from 'bcryptjs';
import { WELCOME_EMAIL_TEMPLATE } from './templates/welcome-email.template';
import { OTP_EMAIL_TEMPLATE } from './templates/otp-email.template';
import { PASSWORD_CHANGED_EMAIL_TEMPLATE } from './templates/password-changed-email.template';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email, true); // Include password for authentication
    if (!user) {
      return null;
    }

    if (user.password && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    
    // Get user's linked auth providers
    const authProviders = await this.usersService.getUserAuthProviders(user.id);
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        linkedProviders: authProviders.map(ap => ap.provider),
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    // Send welcome email
    const welcomeEmailHtml = WELCOME_EMAIL_TEMPLATE.replace('{{firstName}}', user.firstName || 'User');
    await this.notificationService.sendNotification({
      to: user.email,
      subject: 'Welcome to Breedgestone!',
      html: welcomeEmailHtml,
    });

    return {
      message: 'Registration successful. Please login with your credentials.',
      user: {
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
    };
  }

  async oauthLogin(oauthUser: any) {
    const user = await this.usersService.findOrCreateOAuthUser({
      oauthId: oauthUser.oauthId,
      email: oauthUser.email,
      firstName: oauthUser.firstName,
      lastName: oauthUser.lastName,
      oauthProvider: oauthUser.oauthProvider,
    });

    return this.login(user);
  }

  private generateOTP(): string {
    const length = this.configService.get<number>('otp.length', 6);
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // Generate OTP
    const otp = this.generateOTP();

    // Request password reset (sends OTP email automatically)
    await this.usersService.requestPasswordReset(forgotPasswordDto.email, otp);

    const otpExpiresIn = this.configService.get<number>('otp.expiresIn', 600);
    return {
      message: 'Password reset OTP has been sent to your email',
      expiresIn: `${otpExpiresIn / 60} minutes`,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

    // Confirm password reset (verifies OTP and updates password)
    await this.usersService.confirmPasswordReset(email, otp, newPassword);

    const user = await this.usersService.findByEmail(email);
    if (user) {
      // Send confirmation email
      const passwordChangedHtml = PASSWORD_CHANGED_EMAIL_TEMPLATE.replace('{{firstName}}', user.firstName || 'User');
      await this.notificationService.sendNotification({
        to: user.email,
        subject: 'Your Password Has Been Changed',
        html: passwordChangedHtml,
      });
    }

    return {
      message: 'Password has been reset successfully',
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    await this.usersService.changePassword(userId, currentPassword, newPassword);

    const user = await this.usersService.findOne(userId);

    // Send confirmation email
    const passwordChangedHtml = PASSWORD_CHANGED_EMAIL_TEMPLATE.replace('{{firstName}}', user.firstName || 'User');
    await this.notificationService.sendNotification({
      to: user.email,
      subject: 'Your Password Has Been Changed',
      html: passwordChangedHtml,
    });

    return {
      message: 'Password has been changed successfully',
    };
  }
}
