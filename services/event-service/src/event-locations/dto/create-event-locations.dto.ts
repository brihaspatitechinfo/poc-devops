import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEventLocationsDto {
    @ApiProperty({
        description: 'The event ID',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    eventId: number;

    @ApiPropertyOptional({
        description: 'The country ID',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    countryId?: number;

    @ApiPropertyOptional({
        description: 'The state ID',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    stateId?: number;

    @ApiPropertyOptional({
        description: 'The city ID',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    cityId?: number;

    @ApiPropertyOptional({
        description: 'The location ID',
        example: 1
    })
    @IsOptional()
    @IsNumber()
    locationId?: number;
} 