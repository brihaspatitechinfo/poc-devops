import { IsString, IsNumber, IsOptional, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationMasterDto {
  @ApiProperty({
    description: 'Location name',
    example: 'Mumbai, Maharashtra',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  location: string;

  @ApiPropertyOptional({
    description: 'Country ID this location belongs to',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  countryId?: number;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  sort?: number = 0;
} 