import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator to specify which roles can access a route
 * 
 * Usage:
 * @Roles(UserRole.ADMIN)
 * @Roles(UserRole.ADMIN, UserRole.AGENT)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
