import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateEventsCategoryMasterDto {
    @ApiProperty({
        example: 'Technology',
        description: 'Name of the event category',
        type: 'string',
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;
    @ApiProperty({
        example: 1,
        description: 'Sort order for displaying categories',
        type: 'number'
    })
    @IsNumber()
    sortOrder: number;
} 