import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {    
    super({
      clientID: configService.get<string>('oauth.google.clientID', 'dummy-client-id'),
      clientSecret: configService.get<string>('oauth.google.clientSecret', 'dummy-secret'),
      callbackURL: configService.get<string>('oauth.google.callbackURL', 'http://localhost:3000/api/v1/auth/oauth/google/callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const user = {
      oauthId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      oauthProvider: 'google',
      accessToken,
    };
    
    done(null, user);
  }
}
