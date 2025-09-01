import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimezoneMasterResponseDto {
  @ApiProperty({
    description: 'Unique timezone identifier',
    example: 1,
    type: 'number',
  })
  id: number;

  @ApiProperty({
    description: 'Timezone value (timezone identifier)',
    example: 'Asia/Kolkata',
    type: 'string',
  })
  timezoneValue: string;

  @ApiProperty({
    description: 'Timezone abbreviation',
    example: 'IST',
    type: 'string',
  })
  timezoneAbbr: string;

  @ApiPropertyOptional({
    description: 'Timezone offset from UTC',
    example: '+05:30',
    type: 'string',
  })
  timezoneOffset?: string;

  @ApiProperty({
    description: 'Whether this timezone observes daylight saving time',
    example: false,
    type: 'boolean',
  })
  isdst: boolean;

  @ApiPropertyOptional({
    description: 'Human-readable timezone description',
    example: 'India Standard Time',
    type: 'string',
  })
  timezoneText?: string;
} 