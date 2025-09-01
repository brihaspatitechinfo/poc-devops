import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersClient } from '../external-services/user-service/users/users.client';
import { CreateCreditTransactionDto } from './dto/create-credit-transaction.dto';
import { CreditTransactionResponseDto } from './dto/credit-transaction-response.dto';
import { UpdateCreditTransactionDto } from './dto/update-credit-transaction.dto';
import { CreditModule, CreditTransaction } from './entities/credit-transactions.entity';

@Injectable()
export class CreditTransactionsService {
    private readonly logger = new Logger(CreditTransactionsService.name);
    constructor(
        @InjectRepository(CreditTransaction)
        private creditTransactionRepository: Repository<CreditTransaction>,
        private usersClient: UsersClient,
    ) { }

    async create(createCreditTransactionDto: CreateCreditTransactionDto): Promise<{ statusCode: number; message: string; }> {
        try {
            await this.creditTransactionRepository.save(this.creditTransactionRepository.create(createCreditTransactionDto));
            return { statusCode: HttpStatus.CREATED, message: 'Credit transaction created' };
        } catch (error) {

            throw new InternalServerErrorException('Failed to create credit transaction');
        }
    }

    async assignCreditToCorporate(createCreditTransactionDto: CreateCreditTransactionDto): Promise<{ statusCode: number; message: string; }> {
        try {
            const { data: balanceTransferredTo } = await this.usersClient.assignCredit(createCreditTransactionDto.transferredToId, createCreditTransactionDto.amount)
            createCreditTransactionDto.balanceTransferredTo = balanceTransferredTo;
            const { data: balanceTransferredBy } = createCreditTransactionDto.transferredById ? await this.usersClient.deductCredit(createCreditTransactionDto.transferredById, createCreditTransactionDto.amount) : { data: 0.00 };
            createCreditTransactionDto.balanceTransferredBy = balanceTransferredBy;
            await this.creditTransactionRepository.save(this.creditTransactionRepository.create(createCreditTransactionDto));
            return { statusCode: HttpStatus.CREATED, message: 'Assigned credit to corporate Created' };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Credit transaction already exists');
            }
            if (error.response === HttpStatus.NOT_FOUND) {
                throw new NotFoundException(error.response?.message || 'User not found');
            }
            this.logger.error(`Failed to create credit transaction: ${error.message}`);
            throw new InternalServerErrorException('Failed to create credit transaction');
        }
    }

    async deductCreditFromCorporate(createCreditTransactionDto: CreateCreditTransactionDto): Promise<{ statusCode: number; message: string; }> {
        try {
            const corporateUser = await this.usersClient.getUserById(createCreditTransactionDto.transferredById);
            if (!corporateUser) {
                throw new NotFoundException(`Corporate user with ID ${createCreditTransactionDto.transferredById} not found`);
            }
            const corporateBalance = await this.usersClient.getUserCreditBalance(createCreditTransactionDto.transferredById);
            if (createCreditTransactionDto.amount > corporateBalance) {
                throw new BadRequestException('Insufficient credits in corporate account');
            }
            const { data: balanceTransferredBy } = await this.usersClient.deductCredit(createCreditTransactionDto.transferredById, createCreditTransactionDto.amount);
            createCreditTransactionDto.balanceTransferredBy = balanceTransferredBy;
            const { data: balanceTransferredTo } = createCreditTransactionDto.transferredToId ? await this.usersClient.assignCredit(createCreditTransactionDto.transferredToId, createCreditTransactionDto.amount) : { data: 0.00 };
            createCreditTransactionDto.balanceTransferredTo = balanceTransferredTo;
            await this.creditTransactionRepository.save(this.creditTransactionRepository.create(createCreditTransactionDto));
            // if (true) {
            // const corporateUser = await this.usersClient.getUserById(createCreditTransactionDto.transferredToId);
            // const data = {
            //     credit: createCreditTransactionDto.amount,
            //     corporateUser: corporateUser
            // };
            // await this.mailService.sendCorporateCreditAssignmentEmail(corporateUser.email, data);
            // }
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Deducted credit from corporate Created',
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Credit transaction already exists');
            }
            throw new InternalServerErrorException('Failed to create credit transaction');
        }
    }

    async findAll(): Promise<CreditTransactionResponseDto[]> {
        try {
            const transactions = await this.creditTransactionRepository.find({ order: { createdAt: 'DESC' } });
            this.logger.log(`Retrieved ${transactions.length} credit transactions`);
            return transactions.map(transaction => this.mapToResponseDto(transaction));
        } catch (error) {
            this.logger.error(`Error retrieving all credit transactions: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve credit transactions');
        }
    }

    async findOne(id: number): Promise<CreditTransactionResponseDto> {
        try {
            // Validate ID
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid transaction ID provided');
            }

            const transaction = await this.creditTransactionRepository.findOne({ where: { id } });
            if (!transaction) {
                throw new NotFoundException(`Credit transaction with ID ${id} not found`);
            }

            this.logger.log(`Retrieved credit transaction with ID: ${id}`);
            return this.mapToResponseDto(transaction);
        } catch (error) {
            this.logger.error(`Error retrieving credit transaction with ID ${id}: ${error.message}`, error.stack);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to retrieve credit transaction');
        }
    }

    async findByUserId(userId: string): Promise<CreditTransactionResponseDto[]> {
        try {
            const transactions = await this.creditTransactionRepository.find({
                where: [
                    { transferredById: userId },
                    { transferredToId: userId }
                ],
                order: { createdAt: 'DESC' }
            });

            this.logger.log(`Retrieved ${transactions.length} credit transactions for user ID: ${userId}`);
            return transactions.map(transaction => this.mapToResponseDto(transaction));
        } catch (error) {
            this.logger.error(`Error retrieving credit transactions for user ID ${userId}: ${error.message}`, error.stack);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to retrieve credit transactions for user');
        }
    }

    async findByModule(module: string): Promise<CreditTransactionResponseDto[]> {
        try {
            // Validate module
            if (!module) {
                throw new BadRequestException('Module parameter is required');
            }

            if (!Object.values(CreditModule).includes(module as CreditModule)) {
                throw new BadRequestException(`Invalid module. Must be one of: ${Object.values(CreditModule).join(', ')}`);
            }

            const transactions = await this.creditTransactionRepository.find({
                where: { module: module as CreditModule },
                order: { createdAt: 'DESC' }
            });

            this.logger.log(`Retrieved ${transactions.length} credit transactions for module: ${module}`);
            return transactions.map(transaction => this.mapToResponseDto(transaction));
        } catch (error) {
            this.logger.error(`Error retrieving credit transactions for module ${module}: ${error.message}`, error.stack);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to retrieve credit transactions for module');
        }
    }

    async update(id: number, updateCreditTransactionDto: UpdateCreditTransactionDto): Promise<CreditTransactionResponseDto> {
        try {
            // Validate ID
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid transaction ID provided');
            }

            // Validate update data
            this.validateUpdateTransactionData(updateCreditTransactionDto);

            const transaction = await this.creditTransactionRepository.findOne({ where: { id } });
            if (!transaction) {
                throw new NotFoundException(`Credit transaction with ID ${id} not found`);
            }

            Object.assign(transaction, updateCreditTransactionDto);
            const updatedTransaction = await this.creditTransactionRepository.save(transaction);

            this.logger.log(`Credit transaction updated successfully with ID: ${id}`);
            return this.mapToResponseDto(updatedTransaction);
        } catch (error) {
            this.logger.error(`Error updating credit transaction with ID ${id}: ${error.message}`, error.stack);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Credit transaction already exists');
            }

            throw new InternalServerErrorException('Failed to update credit transaction');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            // Validate ID
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid transaction ID provided');
            }

            const transaction = await this.creditTransactionRepository.findOne({ where: { id } });
            if (!transaction) {
                throw new NotFoundException(`Credit transaction with ID ${id} not found`);
            }

            await this.creditTransactionRepository.remove(transaction);
            this.logger.log(`Credit transaction deleted successfully with ID: ${id}`);
        } catch (error) {
            this.logger.error(`Error deleting credit transaction with ID ${id}: ${error.message}`, error.stack);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException('Failed to delete credit transaction');
        }
    }

    async getTransactionStats(): Promise<{
        totalTransactions: number;
        totalAmountTransferred: number;
        averageTransactionAmount: number;
    }> {
        try {
            const [totalTransactions, totalAmount] = await Promise.all([
                this.creditTransactionRepository.count(),
                this.creditTransactionRepository
                    .createQueryBuilder('transaction')
                    .select('SUM(transaction.amount)', 'total')
                    .getRawOne()
            ]);

            const totalAmountTransferred = parseFloat(totalAmount?.total || '0');
            const averageTransactionAmount = totalTransactions > 0 ? totalAmountTransferred / totalTransactions : 0;

            this.logger.log(`Retrieved transaction stats: ${totalTransactions} transactions, ${totalAmountTransferred} total amount`);

            return {
                totalTransactions,
                totalAmountTransferred,
                averageTransactionAmount
            };
        } catch (error) {
            this.logger.error(`Error retrieving transaction stats: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve transaction statistics');
        }
    }

    private validateCreateTransactionData(data: CreateCreditTransactionDto): void {
        if (!data.transferredById) {
            throw new BadRequestException('transferredById is required');
        }

        if (!data.transferredToId) {
            throw new BadRequestException('transferredToId is required');
        }

        if (!data.actionBy) {
            throw new BadRequestException('actionBy is required');
        }

        if (data.transferredById === data.transferredToId) {
            throw new BadRequestException('transferredById and transferredToId cannot be the same');
        }

        if (!data.amount || data.amount <= 0) {
            throw new BadRequestException('amount must be a positive number');
        }

        if (data.balanceTransferredBy < 0) {
            throw new BadRequestException('balanceTransferredBy cannot be negative');
        }

        if (data.balanceTransferredTo < 0) {
            throw new BadRequestException('balanceTransferredTo cannot be negative');
        }

        if (data.remarks && data.remarks.length > 1000) {
            throw new BadRequestException('remarks cannot exceed 1000 characters');
        }
    }

    private validateUpdateTransactionData(data: UpdateCreditTransactionDto): void {
        if (data.transferredById !== undefined && !data.transferredById) {
            throw new BadRequestException('transferredById is required');
        }

        if (data.transferredToId !== undefined && !data.transferredToId) {
            throw new BadRequestException('transferredToId is required');
        }

        if (data.actionBy !== undefined && !data.actionBy) {
            throw new BadRequestException('actionBy is required');
        }

        if (data.transferredById !== undefined && data.transferredToId !== undefined &&
            data.transferredById === data.transferredToId) {
            throw new BadRequestException('transferredById and transferredToId cannot be the same');
        }

        if (data.amount !== undefined && data.amount <= 0) {
            throw new BadRequestException('amount must be a positive number');
        }

        if (data.balanceTransferredBy !== undefined && data.balanceTransferredBy < 0) {
            throw new BadRequestException('balanceTransferredBy cannot be negative');
        }

        if (data.balanceTransferredTo !== undefined && data.balanceTransferredTo < 0) {
            throw new BadRequestException('balanceTransferredTo cannot be negative');
        }

        if (data.remarks !== undefined && data.remarks.length > 1000) {
            throw new BadRequestException('remarks cannot exceed 1000 characters');
        }
    }

    private mapToResponseDto(transaction: CreditTransaction): CreditTransactionResponseDto {
        return {
            id: transaction.id,
            transferredById: transaction.transferredById,
            transferredToId: transaction.transferredToId,
            actionBy: transaction.actionBy,
            module: transaction.module,
            amount: transaction.amount,
            balanceTransferredBy: transaction.balanceTransferredBy,
            balanceTransferredTo: transaction.balanceTransferredTo,
            remarks: transaction.remarks,
            createdAt: transaction.createdAt
        };
    }


    async getTotalModuleCreditsOfCorporate(userId: string, module?: string): Promise<number> {
        try {
            let query = `SELECT SUM(amount) AS total FROM wit_wocademy_credit_transactions WHERE transferredById = ?`;
            const params = [userId]
            if (module) {
                query += ` AND module = ?`;
                params.push(module);
            }
            const result = await this.creditTransactionRepository.manager.query(query, params);
            return Number(result[0]?.total) ?? 0;
        } catch (error) {
            this.logger.error(`Error getting total module credits for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to get total module credits');
        }
    }

    async getTotalCreditsOfCorporateByTransferredByIds(userId: string, transferredByIds: any): Promise<number> {
        try {
            let query = `SELECT SUM(amount) AS total FROM wit_wocademy_credit_transactions WHERE transferredToId = ?`;
            const params = [userId];
            if (transferredByIds) {
                query += ` AND transferredById IN (?)`;
                params.push(transferredByIds);
            }
            const result = await this.creditTransactionRepository.manager.query(query, params);
            return Number(result[0]?.total) ?? 0;
        } catch (error) {
            this.logger.error(`Error getting total module credits for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to get total module credits');
        }
    }

    async getCorporateCreditWithModule(userId: string, module?: string): Promise<number | { wocademyCredits: number; mentorshipCredits: number }> {
        try {
            if (module) {
                return await this.getTotalModuleCreditsOfCorporate(userId, module);
            } else {
                const [wocademyCredits, mentorshipCredits] = await Promise.all([this.getTotalModuleCreditsOfCorporate(userId, CreditModule.WOCADEMY), this.getTotalModuleCreditsOfCorporate(userId, CreditModule.MENTORSHIP)]);
                return {
                    wocademyCredits: Math.round(wocademyCredits),
                    mentorshipCredits: Math.round(mentorshipCredits)
                };
            }
        } catch (error) {
            this.logger.error(`Error getting corporate credits for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to get corporate credits');
        }
    }

} 