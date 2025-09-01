import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CouponResponseDto {
    @ApiProperty({
        description: 'Coupon ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Coupon label',
        example: 'SUMMER2024',
    })
    label: string;

    @ApiProperty({
        description: 'Coupon code',
        example: 'SUMMER24',
    })
    code: string;

    @ApiProperty({
        description: 'Coupon status (0 for inactive, 1 for active)',
        example: 1,
    })
    status: number;

    @ApiProperty({
        description: 'Coupon type (1=Individual, 2=Corporate, 3=All)',
        example: 1,
    })
    couponType: number;

    @ApiProperty({
        description: 'Discount type (Percent or Flat)',
        example: 'Percent',
    })
    discountType: string;

    @ApiPropertyOptional({
        description: 'Maximum number of times this coupon can be used',
        example: 100,
    })
    maximumNumber?: number;

    @ApiPropertyOptional({
        description: 'Coupon expiry date',
        example: '2024-12-31',
    })
    expiryDate?: Date;

    @ApiPropertyOptional({
        description: 'Company domain for corporate coupons',
        example: 'example.com',
    })
    companyDomain?: string;

    @ApiProperty({
        description: 'User ID who created the coupon',
        example: 1,
    })
    createdBy: number;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
} 