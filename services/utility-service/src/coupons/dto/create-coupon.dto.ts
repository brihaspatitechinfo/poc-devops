import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { CouponStatus } from '../coupons.entity';

export class CreateCouponDto {
    @ApiProperty({
        description: 'Coupon label',
        example: 'SUMMER2024',
        maxLength: 20,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 20)
    label: string;

    @ApiProperty({
        description: 'Coupon code (8 characters)',
        example: 'SUMMER24',
        minLength: 8,
        maxLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 8)
    code: string;

    @ApiPropertyOptional({
        description: 'Coupon status (0 for inactive, 1 for active)',
        example: 1,
        enum: [0, 1],
        default: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsIn([0, 1])
    status?: number = CouponStatus.ACTIVE;

    @ApiProperty({
        description: 'Coupon type (1=Individual, 2=Corporate, 3=All)',
        example: 1,
        enum: [1, 2, 3],
    })
    @IsNumber()
    @IsIn([1, 2, 3])
    couponType: number;

    @ApiProperty({
        description: 'Discount type (Percent or Flat)',
        example: 'Percent',
        enum: ['Percent', 'Flat'],
    })
    @IsString()
    @IsIn(['Percent', 'Flat'])
    discountType: string;

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

    @ApiProperty({
        description: 'User ID who created the coupon',
        example: 1,
    })
    @IsNumber()
    createdBy: number;
} 