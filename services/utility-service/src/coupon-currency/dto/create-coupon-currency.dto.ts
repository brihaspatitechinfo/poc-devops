import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCouponCurrencyDto {
    @ApiProperty({
        description: 'Currency ID',
        example: 1,
        minimum: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    currencyId: number;

    @ApiProperty({
        description: 'Coupon ID',
        example: 1,
        minimum: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    couponId: number;

    @ApiProperty({
        description: 'Coupon value in the specified currency',
        example: 10.50,
        minimum: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    value: number;
} 