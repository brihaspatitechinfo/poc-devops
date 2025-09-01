import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true })
export class Permission {
  @ApiProperty({
    description: 'Permission name',
    example: 'Create User',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows creation of new users in the system',
    required: true,
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Permission slug (URL-friendly identifier)',
    example: 'user:create',
    required: true,
  })
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Permission module',
    example: 'user',
    required: true
  })
  @Prop({ required:true })
  module: string;

  @ApiProperty({
    description: 'The action this permission allows',
    example: 'create',
    required: true,
  })
  @Prop({ required: true })
  action: string;

  @ApiProperty({
    description: 'Whether the permission is active',
    example: true,
    required: true,
  })
  @Prop({ required: true, default: true })
  isActive: boolean;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);
