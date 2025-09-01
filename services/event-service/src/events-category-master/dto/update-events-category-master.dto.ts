import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEventsCategoryMasterDto {
    @ApiProperty({
        example: 'Technology',
        description: 'Name of the event category',
        type: 'string',
        maxLength: 255,
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiProperty({
        example: 1,
        description: 'Sort order for displaying categories',
        type: 'number',
        required: false
    })
    @IsOptional()
    @IsNumber()
    sortOrder?: number;
} 