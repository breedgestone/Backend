import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class SendEmailDto {
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

  @IsBoolean()
  @IsOptional()
  sendPush?: boolean = false;
}
