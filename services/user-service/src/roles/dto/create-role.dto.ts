import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
    maxLength: 50,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Role slug (URL-friendly identifier)',
    example: 'admin',
    maxLength: 50,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Administrator role with full access',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'List of permission slugs',
    example: ['user:create', 'user:read', 'user:update', 'user:delete'],
    type: [String],
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rolePermissions?: string[];

  @ApiPropertyOptional({
    description: 'Whether the role is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'ID of the user who created this role',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsMongoId()
  @IsOptional()
  createdBy?: Types.ObjectId;
} 