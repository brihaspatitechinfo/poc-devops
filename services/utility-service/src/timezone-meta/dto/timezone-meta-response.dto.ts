import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TimezoneMetaResponseDto {
    @ApiProperty({
        description: 'Unique identifier for the timezone meta record',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Reference to timezone ID',
        example: 1,
    })
    timezoneId: number;

    @ApiPropertyOptional({
        description: 'Timezone metadata in JSON format',
        example: '{"offset": "-05:00", "dst": true, "abbreviation": "EST"}',
    })
    timezoneMeta?: string;
} 