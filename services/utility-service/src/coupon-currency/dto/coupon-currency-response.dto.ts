import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CouponCurrencyResponseDto {
    @ApiProperty({
        description: 'Coupon currency ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Currency ID',
        example: 1,
    })
    currencyId: number;

    @ApiProperty({
        description: 'Coupon ID',
        example: 1,
    })
    couponId: number;

    @ApiProperty({
        description: 'Coupon value in the specified currency',
        example: 10.50,
    })
    value: number;

    @ApiPropertyOptional({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt?: Date;

    @ApiPropertyOptional({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    updatedAt?: Date;

    @ApiPropertyOptional({
        description: 'Related currency information',
    })
    currency?: any;

    @ApiPropertyOptional({
        description: 'Related coupon information',
    })
    coupon?: any;
} 