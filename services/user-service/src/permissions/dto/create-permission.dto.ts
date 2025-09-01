import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'Can create User',
    description: 'The name of the permission',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Allows creation of new users',
    description: 'Description of what this permission allows',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'user:create',
    description: 'Unique slug identifier for the permission',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-z]+:[a-z]+$/, {
    message: 'Slug must be in format resource:action (e.g. user:create)',
  })
  slug: string;

  @ApiProperty({
    example: 'user',
    description: 'The module this permission belongs to',
  })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiProperty({
    example: '665fcd6fa91434d14f8d0001',
    description: 'The module ID this permission belongs to',
  })

  @ApiProperty({
    example: 'create',
    description: 'The action this permission allows',
  })
  @IsString()
  @IsNotEmpty()
  action: string;
}
