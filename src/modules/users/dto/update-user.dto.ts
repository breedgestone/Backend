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
import { UserStatus } from '../../../common/enums';

// Omit password and email from update (handled separately)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const)
) {
  // Status (admin only)
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  // Agent/Consultant specific fields
  @IsOptional()
  @IsString()
  @MaxLength(100)
  licenseNumber?: string;

  @IsOptional()
  @IsDateString()
  licenseExpiry?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  yearsOfExperience?: number;

  // Vendor specific fields
  @IsOptional()
  @IsBoolean()
  isVendor?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  vendorDescription?: string;

  // FCM Token for push notifications
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
