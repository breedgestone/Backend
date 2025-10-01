import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('oauth.facebook.clientID', 'dummy-client-id'),
      clientSecret: configService.get<string>('oauth.facebook.clientSecret', 'dummy-secret'),
      callbackURL: configService.get<string>('oauth.facebook.callbackURL', 'http://localhost:3000/api/v1/auth/oauth/facebook/callback'),
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    
    const user = {
      oauthId: id,
      email: emails && emails[0] ? emails[0].value : null,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos && photos[0] ? photos[0].value : null,
      oauthProvider: 'facebook',
      accessToken,
    };
    
    done(null, user);
  }
  
}
