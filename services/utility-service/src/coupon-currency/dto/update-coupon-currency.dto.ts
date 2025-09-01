import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCouponCurrencyDto {
    @ApiPropertyOptional({
        description: 'Currency ID',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    currencyId?: number;

    @ApiPropertyOptional({
        description: 'Coupon ID',
        example: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    couponId?: number;

    @ApiPropertyOptional({
        description: 'Coupon value in the specified currency',
        example: 10.50,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    value?: number;
} 