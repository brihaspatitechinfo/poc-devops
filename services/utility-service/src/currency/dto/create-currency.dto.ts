import { IsString, IsNumber, IsOptional, IsNotEmpty, Length, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'Currency name',
    example: 'Indian Rupee',
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  currency: string;

  @ApiProperty({
    description: 'Currency code (3 characters)',
    example: 'INR',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  code: string;

  @ApiProperty({
    description: 'Currency symbol',
    example: '₹',
    maxLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 5)
  symbol: string;

  @ApiPropertyOptional({
    description: 'Currency status (1 for active, 0 for inactive)',
    example: 1,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  status?: number = 1;

  @ApiPropertyOptional({
    description: 'Decimal digits for the currency',
    example: '2',
  })
  @IsOptional()
  @IsString()
  decimalDigits?: string;

  @ApiPropertyOptional({
    description: 'Sort order for display',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number = 0;
} 