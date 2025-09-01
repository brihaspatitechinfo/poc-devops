import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({
    description: 'Country ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Country shortname',
    example: 'IND',
  })
  shortname: string;

  @ApiProperty({
    description: 'Country name',
    example: 'India',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Country dial code',
    example: '+91',
  })
  dialCode?: string;

  @ApiPropertyOptional({
    description: 'Country phone code',
    example: 91,
  })


  @ApiProperty({
    description: 'Country status',
    example: 1,
  })
  status: number;

  @ApiPropertyOptional({
    description: 'States in this country',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Maharashtra' },
      },
    },
  })
  states?: any[];

  @ApiPropertyOptional({
    description: 'Currency mappings for this country',
    type: 'array',
  })
  currencyMappings?: any[];
} 