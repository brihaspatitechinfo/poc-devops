import { IsString, IsOptional, IsNumber, IsNotEmpty, Length, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    description: 'Country shortname (3 characters)',
    example: 'IND',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  shortname: string;

  @ApiProperty({
    description: 'Country name',
    example: 'India',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  name: string;

  @ApiPropertyOptional({
    description: 'Country dial code',
    example: '+91',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(0, 10)
  dialCode?: string;

  @ApiPropertyOptional({
    description: 'Country phone code',
    example: 91,
  })
  @IsOptional()
  @IsNumber()


  @ApiPropertyOptional({
    description: 'Country status (1 for active, 0 for inactive)',
    example: 1,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  status?: number = 1;
} 