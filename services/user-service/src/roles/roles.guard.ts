import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector, private permissionService: PermissionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredPermissions = this.reflector.get<string[]>('permissions' , context.getHandler());
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.id) {
      throw new ForbiddenException('User not found in request');
    }
    
    const userPermissions = await this.permissionService.getUserPermissions(user.id);
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
    
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
} 