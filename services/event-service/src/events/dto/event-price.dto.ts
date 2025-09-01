import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class EventPriceDto {
    @ApiProperty({
        example: 1,
        description: 'Currency ID',
        type: 'number'
    })
    @IsNumber()
    @Type(() => Number)
    currencyId: number;

    @ApiProperty({
        example: 999.99,
        description: 'Price amount',
        type: 'number'
    })
    @IsNumber()
    @Type(() => Number)
    price: number;
} 