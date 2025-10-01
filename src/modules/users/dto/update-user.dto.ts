import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsBoolean, 
  IsNumber,
  IsArray,
  IsDateString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../../../common/enums';

// Omit password and email from update (handled separately)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const)
) {
  // Status (admin only)
  @ApiPropertyOptional({
    example: 'active',
    description: 'User account status (admin only)',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  // Agent/Consultant specific fields
  @ApiPropertyOptional({
    example: 'LIC12345',
    description: 'Professional license number',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  licenseNumber?: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description: 'License expiry date',
  })
  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;

  @ApiPropertyOptional({
    example: ['Real Estate', 'Property Management'],
    description: 'Areas of specialization',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({
    example: 5,
    description: 'Years of professional experience',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  yearsOfExperience?: number;

  // Vendor specific fields
  @ApiPropertyOptional({
    example: true,
    description: 'Whether user is a vendor',
  })
  @IsOptional()
  @IsBoolean()
  isVendor?: boolean;

  @ApiPropertyOptional({
    example: 'We provide high-quality construction materials',
    description: 'Vendor business description',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  vendorDescription?: string;

  // FCM Token for push notifications
  @ApiPropertyOptional({
    example: 'fcm_token_here',
    description: 'Firebase Cloud Messaging token for push notifications',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
