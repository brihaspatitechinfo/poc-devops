import { IsString, IsNumber, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({
    description: 'City name',
    example: 'Mumbai',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'State ID this city belongs to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  stateId: number;

  @ApiPropertyOptional({
    description: 'Country ID this city belongs to',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  countryId?: number;
} 