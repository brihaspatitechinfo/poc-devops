import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { CreditModule } from '../entities/credit-transactions.entity';

export class UpdateCreditTransactionDto {
    @ApiPropertyOptional({
        description: 'User ID who transferred the credits',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    transferredById?: number;

    @ApiPropertyOptional({
        description: 'User ID who received the credits',
        example: 2,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    transferredToId?: number;

    @ApiPropertyOptional({
        description: 'User ID who performed the action',
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    actionBy?: number;

    @ApiPropertyOptional({
        description: 'Module type (WOCADEMY or MENTORSHIP)',
        example: 'WOCADEMY',
        enum: CreditModule,
    })
    @IsOptional()
    @IsEnum(CreditModule)
    module?: CreditModule;

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