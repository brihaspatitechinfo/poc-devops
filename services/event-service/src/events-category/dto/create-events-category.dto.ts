import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateEventsCategoryDto {
    @ApiProperty({
        example: 1,
        description: 'Event ID',
        type: 'number'
    })
    @IsNumber()
    @IsPositive()
    eventId: number;

    @ApiProperty({
        example: 1,
        description: 'Category ID',
        type: 'number'
    })
    @IsNumber()
    @IsPositive()
    categoryId: number;
} 