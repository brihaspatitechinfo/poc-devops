import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateTimezoneMetaDto {
    @ApiProperty({
        description: 'Reference to timezone ID',
        example: 1,
        minimum: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    timezoneId: number;

    @ApiPropertyOptional({
        description: 'Timezone metadata in JSON format',
        example: '{"offset": "-05:00", "dst": true, "abbreviation": "EST"}',
        maxLength: 65535,
    })
    @IsOptional()
    @IsString()
    @MaxLength(65535)
    timezoneMeta?: string;
} 