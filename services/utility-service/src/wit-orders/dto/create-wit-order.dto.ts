import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
import { MoneyType, OrderStatus } from '../entities/wit-orders.entity';

export class CreateWitOrderDto {
    @ApiProperty({
        description: 'Unique order number',
        example: 'ORD-2024-001',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    orderNum: string;

    @ApiPropertyOptional({
        description: 'External order ID',
        example: 'EXT-ORDER-123',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    orderId?: string;

    @ApiProperty({
        description: 'User ID who placed the order',
        example: 'user123',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    userId: string;

    @ApiProperty({
        description: 'Currency ID for the order',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    currencyId: number;

    @ApiProperty({
        description: 'Order amount',
        example: 299.99,
        minimum: 0,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({
        description: 'Type of money used for payment',
        example: MoneyType.REAL,
        enum: MoneyType,
    })
    @IsNotEmpty()
    @IsEnum(MoneyType)
    moneyType: MoneyType;

    @ApiProperty({
        description: 'Credit balance after transaction',
        example: 500.00,
        minimum: 0,
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    balanceCredit: number;

    @ApiProperty({
        description: 'Module type: wocademy, events, mentorship',
        example: 'wocademy',
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    moduleType: string;

    @ApiProperty({
        description: 'Module ID reference',
        example: 1,
    })
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    moduleId: number;

    @ApiPropertyOptional({
        description: 'Order status',
        example: OrderStatus.PENDING,
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus = OrderStatus.PENDING;

    @ApiPropertyOptional({
        description: 'Additional order metadata',
        example: { paymentMethod: 'stripe', transactionId: 'txn_123' },
    })
    @IsOptional()
    orderMeta?: any;
} 