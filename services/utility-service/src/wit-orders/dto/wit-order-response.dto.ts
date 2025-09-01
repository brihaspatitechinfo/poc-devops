import { ApiProperty } from '@nestjs/swagger';
import { MoneyType, OrderStatus } from '../entities/wit-orders.entity';

export class WitOrderResponseDto {
    @ApiProperty({
        description: 'Order ID',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Unique order number',
        example: 'ORD-2024-001',
    })
    orderNum: string;

    @ApiProperty({
        description: 'External order ID',
        example: 'EXT-ORDER-123',
        nullable: true,
    })
    orderId: string;

    @ApiProperty({
        description: 'User ID who placed the order',
        example: 'user123',
    })
    userId: string;

    @ApiProperty({
        description: 'Currency ID for the order',
        example: 1,
    })
    currencyId: number;

    @ApiProperty({
        description: 'Order amount',
        example: 299.99,
    })
    amount: number;

    @ApiProperty({
        description: 'Type of money used for payment',
        example: MoneyType.REAL,
        enum: MoneyType,
    })
    moneyType: MoneyType;

    @ApiProperty({
        description: 'Credit balance after transaction',
        example: 500.00,
    })
    balanceCredit: number;

    @ApiProperty({
        description: 'Module type: wocademy, events, mentorship',
        example: 'wocademy',
    })
    moduleType: string;

    @ApiProperty({
        description: 'Module ID reference',
        example: 1,
    })
    moduleId: number;

    @ApiProperty({
        description: 'Order status',
        example: OrderStatus.PENDING,
        enum: OrderStatus,
    })
    status: OrderStatus;

    @ApiProperty({
        description: 'Additional order metadata',
        example: { paymentMethod: 'stripe', transactionId: 'txn_123' },
        nullable: true,
    })
    orderMeta: any;

    @ApiProperty({
        description: 'Order creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Order last update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    updatedAt: Date;
} 