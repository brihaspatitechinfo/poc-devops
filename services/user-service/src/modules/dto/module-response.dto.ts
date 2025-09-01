import { ApiProperty } from '@nestjs/swagger';

export class SubModuleResponseDto {
  @ApiProperty({
    example: 'Cohort',
    description: 'Name of the sub-module',
  })
  name: string;

  @ApiProperty({
    example: 'cohort',
    description: 'Slug of the sub-module',
  })
  slug: string;

  @ApiProperty({
    example: 'Cohort management',
    description: 'Description of the sub-module',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Status of the sub-module (active/inactive)',
  })
  isActive: boolean;
}

export class ModuleResponseDto {
  @ApiProperty({
    example: '665ffe123b7a4b0df8f12345',
    description: 'Unique identifier for the module',
  })
  _id: string;

  @ApiProperty({
    example: 'User Management',
    description: 'The name of the module',
  })
  name: string;

  @ApiProperty({
    example: 'mod_user_mgmt',
    description: 'Unique slug identifier for the module',
  })
  slug: string;

  @ApiProperty({
    example: 'Top-level user module',
    description: 'Description of the module',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: [
      {
        name: 'Cohort',
        slug: 'cohort',
        description: 'Cohort management',
        isActive: true
      }
    ],
    description: 'List of sub-modules',
    type: [SubModuleResponseDto],
  })
  subModules: SubModuleResponseDto[];

  @ApiProperty({
    example: true,
    description: 'Status of the module (active/inactive)',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2025-06-20T09:32:11.123Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-06-20T09:32:11.123Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
} 