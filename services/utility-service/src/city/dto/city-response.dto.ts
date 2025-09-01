import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty({
    description: 'City ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'City name',
    example: 'Mumbai',
  })
  name: string;

  @ApiProperty({
    description: 'State ID this city belongs to',
    example: 1,
  })
  stateId: number;

  @ApiPropertyOptional({
    description: 'Country ID this city belongs to',
    example: 1,
  })
  countryId?: number;

  @ApiPropertyOptional({
    description: 'State details',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Maharashtra' },
    },
  })
  state?: any;
} 