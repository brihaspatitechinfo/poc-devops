import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreditModule } from '../entities/credit-transactions.entity';

export class CreditTransactionResponseDto {
    @ApiProperty({
        description: 'Unique identifier for the credit transaction',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'User ID who transferred the credits',
        example: '1',
    })
    transferredById: string;

    @ApiProperty({
        description: 'User ID who received the credits',
        example: '2',
    })
    transferredToId: string;

    @ApiProperty({
        description: 'User ID who performed the action',
        example: '1',
    })
    actionBy: string;

    @ApiProperty({
        description: 'Module type (WOCADEMY or MENTORSHIP)',
        example: 'WOCADEMY',
        enum: CreditModule,
    })
    module: CreditModule;

    @ApiProperty({
        description: 'Amount transferred',
        example: 100.50,
    })
    amount: number;

    @ApiProperty({
        description: 'Balance of user who transferred credits after transaction',
        example: 500.00,
    })
    balanceTransferredBy: number;

    @ApiProperty({
        description: 'Balance of user who received credits after transaction',
        example: 600.50,
    })
    balanceTransferredTo: number;

    @ApiPropertyOptional({
        description: 'Additional remarks for the transaction',
        example: 'Credit transfer for completed course',
    })
    remarks?: string;

    @ApiProperty({
        description: 'Timestamp when the transaction was created',
        example: '2024-01-15T10:30:00.000Z',
    })
    createdAt: Date;
} 