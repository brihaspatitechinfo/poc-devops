import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateCouponDto {
    @ApiPropertyOptional({
        description: 'Coupon label',
        example: 'SUMMER2024',
        maxLength: 20,
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    label?: string;

    @ApiPropertyOptional({
        description: 'Coupon code (8 characters)',
        example: 'SUMMER24',
        minLength: 8,
        maxLength: 8,
    })
    @IsOptional()
    @IsString()
    @Length(8, 8)
    code?: string;

    @ApiPropertyOptional({
        description: 'Coupon status (0 for inactive, 1 for active)',
        example: 1,
        enum: [0, 1],
    })
    @IsOptional()
    @IsNumber()
    @IsIn([0, 1])
    status?: number;

    @ApiPropertyOptional({
        description: 'Coupon type (1=Individual, 2=Corporate, 3=All)',
        example: 1,
        enum: [1, 2, 3],
    })
    @IsOptional()
    @IsNumber()
    @IsIn([1, 2, 3])
    couponType?: number;

    @ApiPropertyOptional({
        description: 'Discount type (Percent or Flat)',
        example: 'Percent',
        enum: ['Percent', 'Flat'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['Percent', 'Flat'])
    discountType?: string;

    @ApiPropertyOptional({
        description: 'Maximum number of times this coupon can be used',
        example: 100,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maximumNumber?: number;

    @ApiPropertyOptional({
        description: 'Coupon expiry date',
        example: '2024-12-31',
    })
    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @ApiPropertyOptional({
        description: 'Company domain for corporate coupons',
        example: 'example.com',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @Length(1, 255)
    companyDomain?: string;
} 