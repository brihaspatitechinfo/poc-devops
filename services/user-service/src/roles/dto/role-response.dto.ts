import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    description: 'Unique role identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
  })
  name: string;

  @ApiProperty({
    description: 'Role slug (URL-friendly identifier)',
    example: 'admin',
  })
  slug: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role with full access',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'List of permission slugs',
    example: ['user:create', 'user:read', 'user:update', 'user:delete'],
    type: [String],
  })
  rolePermissions: string[];

  @ApiProperty({
    description: 'Whether the role is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'ID of the user who created this role',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  createdBy?: string;

  @ApiProperty({
    description: 'ID of the user who last updated this role',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
} 