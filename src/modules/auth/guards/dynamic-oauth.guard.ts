import { Injectable, CanActivate, ExecutionContext, BadRequestException, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GoogleAuthGuard } from './google-auth.guard';
import { FacebookAuthGuard } from './facebook-auth.guard';

@Injectable()
export class DynamicOAuthGuard implements CanActivate {
  constructor(private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const provider = request.params.provider?.toLowerCase();

    if (!provider) {
      throw new BadRequestException('OAuth provider is required');
    }

    const guardClass = this.getGuardClass(provider);
    const guard = new guardClass();

    return guard.canActivate(context);
  }

  private getGuardClass(provider: string): Type<any> {
    switch (provider) {
      case 'google':
        return GoogleAuthGuard;
      case 'facebook':
        return FacebookAuthGuard;
      default:
        throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }
  }
}
