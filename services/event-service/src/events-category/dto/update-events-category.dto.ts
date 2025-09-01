import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateEventsCategoryDto {
    @ApiProperty({
        example: 1,
        description: 'Event ID',
        type: 'number',
        required: false
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    eventId?: number;

    @ApiProperty({
        example: 1,
        description: 'Category ID',
        type: 'number',
        required: false
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    categoryId?: number;
} 