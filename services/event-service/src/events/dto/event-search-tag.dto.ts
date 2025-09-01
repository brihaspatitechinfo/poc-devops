import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class EventSearchTagDto {
    @ApiProperty({
        example: 1,
        description: 'Search tag ID',
        type: 'number'
    })
    @IsNumber()
    tagId: number;
} 