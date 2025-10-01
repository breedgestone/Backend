import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    UsersModule,
    NotificationModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret', 'your-super-secret-jwt-key-change-this-in-production'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn', '1h') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    GoogleStrategy, 
    FacebookStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
