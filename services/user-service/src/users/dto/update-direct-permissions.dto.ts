import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, Matches } from 'class-validator';

export class UpdateDirectPermissionsDto {
    @ApiProperty({
        description: 'Array of permission slugs to assign as direct permissions',
        example: ['user:create', 'user:read', 'user:update'],
        type: [String],
        required: true  
    })
    @IsArray()
    @IsString({ each: true, message: 'Each permission must be a string' })
    @Matches(/^[a-z]+:[a-z]+$/, {
        each: true,
        message: 'Each permission must be in format resource:action (e.g. user:create)'
    })
    directPermissions: string[];
} 