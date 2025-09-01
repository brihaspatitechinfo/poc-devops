import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateIf } from 'class-validator';
import { CreditModule } from '../entities/credit-transactions.entity';

export class CreateCreditTransactionDto {
    @ApiPropertyOptional({
        description: 'User ID who transferred the credits (Required for deduct-credit-from-corporate)',
        example: '1',
    })
    @ValidateIf((o) => o.transferredToId === undefined || o.transferredToId === null)
    @IsNotEmpty({ message: 'transferredById is required when transferredToId is not provided (for deduct-credit-from-corporate)' })
    @IsString()
    transferredById?: string;

    @ApiPropertyOptional({
        description: 'User ID who received the credits (Required for assign-credit-to-corporate)',
        example: '2',
    })
    @ValidateIf((o) => o.transferredById === undefined || o.transferredById === null)
    @IsNotEmpty({ message: 'transferredToId is required when transferredById is not provided (for assign-credit-to-corporate)' })
    @IsString()
    transferredToId: string;

    @ApiPropertyOptional({
        description: 'User ID who performed the action',
        example: '1',
    })
    @IsOptional()
    @IsString()
    actionBy?: string;

    @ApiPropertyOptional({
        description: 'Module type (WOCADEMY or MENTORSHIP)',
        example: 'WOCADEMY',
        enum: CreditModule,
        default: CreditModule.WOCADEMY,
    })
    @IsOptional()
    @IsEnum(CreditModule)
    module?: CreditModule = CreditModule.WOCADEMY;

    @ApiPropertyOptional({
        description: 'Amount to transfer',
        example: 100.50,
        minimum: 0.01,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    amount?: number;

    @ApiPropertyOptional({
        description: 'Balance of user who transferred credits after transaction',
        example: 500.00,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    balanceTransferredBy?: number;

    @ApiPropertyOptional({
        description: 'Balance of user who received credits after transaction',
        example: 600.50,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber()
    balanceTransferredTo?: number;

    @ApiPropertyOptional({
        description: 'Additional remarks for the transaction',
        example: 'Credit transfer for completed course',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    remarks?: string;
} 