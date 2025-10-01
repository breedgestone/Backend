import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInspectionDto {
  @ApiProperty({ description: 'Property ID to inspect', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  propertyId: number;

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

  @ApiProperty({ description: 'Preferred inspection date and time', example: '2025-10-15T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  preferredDateTime: string;

  @ApiPropertyOptional({ description: 'Additional message or special requests', example: 'Please call before arrival' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'Inspection fee amount', example: 30000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
