import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class SendNotificationDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsString()
  @IsOptional()
  deviceToken?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsOptional()
  data?: Record<string, string>;

  // Control flags
  @IsBoolean()
  @IsOptional()
  sendPush?: boolean = false;
}
