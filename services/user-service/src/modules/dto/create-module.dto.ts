import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsBoolean , ValidateNested } from 'class-validator';
import { SubModuleDto } from './sub-module.dto';

export class CreateModuleDto {
  @ApiProperty({
    example: 'User Management',
    description: 'The name of the module',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'employee',
    description: 'Unique slug identifier for the module',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'Top-level user module',
    description: 'Description of the module',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example:[{
      name: 'Cohort',
      slug: 'cohort',
      description: 'Cohort management',
      isActive: true
    }],
    description: 'List of sub-modules',
    required: false,
    type: [SubModuleDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubModuleDto)
  subModules?: SubModuleDto[];

  @ApiProperty({
    example: true,
    description: 'Status of the module (active/inactive)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 