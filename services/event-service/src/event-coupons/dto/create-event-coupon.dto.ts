import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventCouponDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsNumber()
    couponId: number;
} 