import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsEnum,
  IsPhoneNumber,
  IsDateString,
  IsUrl,
  IsBoolean,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';

export class CreateUserDto {
  // Basic Information
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password (min 8 characters, must contain uppercase, lowercase, and number/special character)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and number/special character',
  })
  password: string;

  @ApiPropertyOptional({
    example: '+2348012345678',
    description: 'User phone number (international format)',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  // Profile Information
  @ApiPropertyOptional({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePicture?: string;

  @ApiPropertyOptional({
    example: 'male',
    description: 'User gender',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    example: '1990-01-15',
    description: 'Date of birth (ISO 8601 format)',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    example: 'Software developer passionate about technology',
    description: 'User biography',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;

  @ApiPropertyOptional({
    example: '123 Main Street',
    description: 'Street address',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    example: 'Lagos',
    description: 'City',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    example: 'Lagos State',
    description: 'State/Province',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({
    example: 'Nigeria',
    description: 'Country',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
