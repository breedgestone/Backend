import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class OAuthUserDto {
  @IsString()
  @IsNotEmpty()
  oauthId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  oauthProvider: string;
}
