import { IsString, IsOptional, IsObject } from 'class-validator';

export class SendPushDto {
  @IsString()
  deviceToken: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}
