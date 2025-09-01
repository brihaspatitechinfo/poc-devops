import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTimezoneMasterDto {
  @ApiProperty({
    description: 'Timezone value (e.g., timezone identifier)',
    example: 'Asia/Kolkata',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Timezone value is required' })
  @IsString()
  @MaxLength(255, { message: 'Timezone value cannot exceed 255 characters' })
  timezoneValue: string;

  @ApiProperty({
    description: 'Timezone abbreviation',
    example: 'IST',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Timezone abbreviation is required' })
  @IsString()
  @MaxLength(255, { message: 'Timezone abbreviation cannot exceed 255 characters' })
  timezoneAbbr: string;

  @ApiPropertyOptional({
    description: 'Timezone offset from UTC',
    example: '+05:30',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Timezone offset cannot exceed 255 characters' })
  timezoneOffset?: string;

  @ApiPropertyOptional({
    description: 'Whether this timezone observes daylight saving time',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isdst?: boolean = false;

  @ApiPropertyOptional({
    description: 'Human-readable timezone description',
    example: 'India Standard Time',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Timezone text cannot exceed 255 characters' })
  timezoneText?: string;
} 