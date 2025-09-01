import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    private readonly logger = new Logger(PermissionsGuard.name);
    private readonly userServiceUrl: string;

    constructor(
        private reflector: Reflector,
        private configService: ConfigService
    ) {
        this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://user-service:3002';
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
            if (!requiredPermissions || requiredPermissions.length === 0) return true;

            const request = context.switchToHttp().getRequest();
            const userId = request.headers['x-user-id'];

            if (!userId) {
                throw new ForbiddenException('No user ID found in headers');
            }

            // Call user-service to get user permissions
            const permissions = await this.getUserPermissions(userId);

            if (!Array.isArray(permissions) || permissions.length === 0) {
                throw new ForbiddenException('No permissions found for user');
            }

            const hasPermission = requiredPermissions.some(p => permissions.includes(p));
            if (!hasPermission) {
                throw new ForbiddenException(
                    `Insufficient permissions. Required permissions: ${requiredPermissions.join(', ')}. ` +
                    `User permissions: ${permissions.join(', ')}. ` +
                    `Please ensure you have valid authentication and authorization to access this resource.`
                );
            }

            // Attach permissions to request for use in controllers
            request.headers['x-all-user-permissions'] = permissions;
            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            this.logger.error(`Error checking permissions: ${error.message}`, error.stack);
            throw new ForbiddenException(`Error checking permissions: ${error.message}`);
        }
    }

    private async getUserPermissions(userId: string): Promise<string[]> {
        try {
            const response = await axios.get(`${this.userServiceUrl}/api/v1/users/${userId}/permissions`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                validateStatus: () => true,
            });

            if (response.status !== 200) {
                this.logger.warn(`Failed to get permissions for user ${userId}: ${response.status}`);
                return [];
            }

            return response.data.permissions || [];
        } catch (error) {
            this.logger.error(`Error calling user service for permissions: ${error.message}`, error.stack);
            return [];
        }
    }
} 