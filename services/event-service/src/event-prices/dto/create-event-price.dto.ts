import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateEventPriceDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    eventId: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    currencyId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;
} 