import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationMasterResponseDto {
  @ApiProperty({
    description: 'Location ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Location name',
    example: 'Mumbai, Maharashtra',
  })
  location: string;

  @ApiPropertyOptional({
    description: 'Country ID this location belongs to',
    example: 1,
  })
  countryId?: number;

  @ApiProperty({
    description: 'Sort order for display',
    example: 0,
  })
  sort: number;

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
} 