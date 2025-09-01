import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../permissions/permissions.decorator';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionsService,
    private configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {

      // const permissions = await this.permissionService.getUserPermissions(userId);
      // if (!Array.isArray(permissions) || permissions.length === 0) {
      //   throw new ForbiddenException('No permissions found for user');
      // }
      // const hasPermission = requiredPermissions.some(p => permissions.includes(p));
      // if (!hasPermission) {
      //   throw new ForbiddenException(
      //     `Insufficient permissions. Required permissions: ${requiredPermissions.join(', ')}. ` +
      //     `User permissions: ${permissions.join(', ')}. ` +
      //     `Please ensure you have valid authentication and authorization to access this resource.`
      //   );
      // }
      // request.headers['x-all-user-permissions'] = permissions;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException(`Error checking permissions: ${error.message}`);
    }
  }
}
