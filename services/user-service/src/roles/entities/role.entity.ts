import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Role slug (URL-friendly identifier)',
    example: 'role:admin',
    required: true,
  })
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator role with full access',
    required: false,
  })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'List of permission slugs',
    example: ['user:create', 'user:read', 'user:update', 'user:delete', 'role:create', 'role:read', 'role:update', 'role:delete', 'permission:create', 'permission:read', 'permission:update', 'permission:delete'],
    required: false,
  })
  @Prop({ type: [String], default: [] })
  rolePermissions: string[];

  @ApiProperty({
    description: 'Whether the role is active',
    example: true,
    required: true,
  })
  @Prop({ required: true, default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'ID of the user who created this role',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @Prop({ type: Types.ObjectId, required: false })
  createdBy: Types.ObjectId;

  @ApiProperty({
    description: 'ID of the user who last updated this role',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @Prop({ type: Types.ObjectId })
  updatedBy: Types.ObjectId;

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

export const RoleSchema = SchemaFactory.createForClass(Role); 