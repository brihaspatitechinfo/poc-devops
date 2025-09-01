import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StateResponseDto {
  @ApiProperty({
    description: 'State ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'State name',
    example: 'Maharashtra',
  })
  name: string;

  @ApiProperty({
    description: 'Country ID this state belongs to',
    example: 1,
  })
  countryId: number;

  @ApiPropertyOptional({
    description: 'Country details',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'India' },
      shortname: { type: 'string', example: 'IND' },
    },
  })
  country?: any;

  @ApiPropertyOptional({
    description: 'Cities in this state',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Mumbai' },
      },
    },
  })
  cities?: any[];
} 