import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Recipient email address',
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    example: 'Welcome to Breedgestone',
    description: 'Email subject',
  })
  @IsString()
  subject: string;

  @ApiPropertyOptional({
    example: 'Welcome to our platform!',
    description: 'Plain text email content',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    example: '<h1>Welcome!</h1><p>Thank you for joining us</p>',
    description: 'HTML email content',
  })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Also send push notification',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  sendPush?: boolean = false;
}
