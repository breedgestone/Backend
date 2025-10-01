import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsultationDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+2348012345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Preferred consultation date and time', example: '2025-10-15T14:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  preferredDateTime: string;

  @ApiPropertyOptional({ description: 'Consultation topic or questions', example: 'Need advice on property investment' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'Consultation fee amount', example: 50000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
