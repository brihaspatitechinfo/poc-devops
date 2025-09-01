import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({
    description: 'Currency ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Currency name',
    example: 'Indian Rupee',
  })
  currency: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'INR',
  })
  code: string;

  @ApiProperty({
    description: 'Currency symbol',
    example: '₹',
  })
  symbol: string;

  @ApiProperty({
    description: 'Currency status',
    example: 1,
  })
  status: number;

  @ApiPropertyOptional({
    description: 'Decimal digits for the currency',
    example: '2',
  })
  decimalDigits?: string;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
  })
  sortOrder: number;

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

  @ApiPropertyOptional({
    description: 'Country mappings for this currency',
    type: 'array',
  })
  countryMappings?: any[];
} 