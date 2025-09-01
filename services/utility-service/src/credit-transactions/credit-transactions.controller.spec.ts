import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreditTransactionsController } from './credit-transactions.controller';
import { CreditTransactionsService } from './credit-transactions.service';
import { CreateCreditTransactionDto } from './dto/create-credit-transaction.dto';
import { CreditTransactionResponseDto } from './dto/credit-transaction-response.dto';
import { UpdateCreditTransactionDto } from './dto/update-credit-transaction.dto';
import { CreditModule } from './entities/credit-transactions.entity';

describe('CreditTransactionsController', () => {
    let controller: CreditTransactionsController;
    let service: CreditTransactionsService;

    const mockCreditTransactionResponse: CreditTransactionResponseDto = {
        id: 1,
        transferredById: '1',
        transferredToId: '2',
        actionBy: '1',
        module: CreditModule.WOCADEMY,
        amount: 100.50,
        balanceTransferredBy: 500.00,
        balanceTransferredTo: 600.50,
        remarks: 'Credit transfer for completed course',
        createdAt: new Date(),
    };

    const mockCreditTransactionsService = {
        assignCreditToCorporate: jest.fn(),
        deductCreditFromCorporate: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByUserId: jest.fn(),
        findByModule: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        getTransactionStats: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CreditTransactionsController],
            providers: [
                {
                    provide: CreditTransactionsService,
                    useValue: mockCreditTransactionsService,
                },
            ],
        }).compile();

        controller = module.get<CreditTransactionsController>(CreditTransactionsController);
        service = module.get<CreditTransactionsService>(CreditTransactionsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('assignCreditToCorporate', () => {
        const createCreditTransactionDto: CreateCreditTransactionDto = {
            transferredById: '1',
            transferredToId: '2',
            actionBy: '1',
            module: CreditModule.WOCADEMY,
            amount: 100.50,
            balanceTransferredBy: 500.00,
            balanceTransferredTo: 600.50,
            remarks: 'Credit transfer for completed course',
        };

        it('should create a credit transaction successfully', async () => {
            mockCreditTransactionsService.assignCreditToCorporate.mockResolvedValue(mockCreditTransactionResponse);

            const result = await controller.assignCreditToCorporate(createCreditTransactionDto);

            expect(service.assignCreditToCorporate).toHaveBeenCalledWith(createCreditTransactionDto);
            expect(result).toEqual(mockCreditTransactionResponse);
        });
    });

    describe('findAll', () => {
        it('should return all credit transactions', async () => {
            const mockTransactions = [mockCreditTransactionResponse];
            mockCreditTransactionsService.findAll.mockResolvedValue(mockTransactions);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockTransactions);
        });
    });

    describe('getStats', () => {
        it('should return transaction statistics', async () => {
            const mockStats = {
                totalTransactions: 10,
                totalAmountTransferred: 1000.00,
                averageTransactionAmount: 100.00,
            };
            mockCreditTransactionsService.getTransactionStats.mockResolvedValue(mockStats);

            const result = await controller.getStats();

            expect(service.getTransactionStats).toHaveBeenCalled();
            expect(result).toEqual(mockStats);
        });
    });

    describe('findByUserId', () => {
        it('should return credit transactions for a user', async () => {
            const userId = '1';
            const mockTransactions = [mockCreditTransactionResponse];
            mockCreditTransactionsService.findByUserId.mockResolvedValue(mockTransactions);

            const result = await controller.findByUserId(userId);

            expect(service.findByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockTransactions);
        });
    });

    describe('findByModule', () => {
        it('should return credit transactions for a module', async () => {
            const module = CreditModule.WOCADEMY;
            const mockTransactions = [mockCreditTransactionResponse];
            mockCreditTransactionsService.findByModule.mockResolvedValue(mockTransactions);

            const result = await controller.findByModule(module);

            expect(service.findByModule).toHaveBeenCalledWith(module);
            expect(result).toEqual(mockTransactions);
        });
    });

    describe('findOne', () => {
        it('should return a credit transaction by ID', async () => {
            const id = 1;
            mockCreditTransactionsService.findOne.mockResolvedValue(mockCreditTransactionResponse);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockCreditTransactionResponse);
        });

        it('should handle not found exception', async () => {
            const id = 999;
            mockCreditTransactionsService.findOne.mockRejectedValue(new NotFoundException('Credit transaction not found'));

            await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        const updateCreditTransactionDto: UpdateCreditTransactionDto = {
            remarks: 'Updated remarks',
        };

        it('should update a credit transaction successfully', async () => {
            const id = 1;
            const updatedTransaction = { ...mockCreditTransactionResponse, remarks: 'Updated remarks' };
            mockCreditTransactionsService.update.mockResolvedValue(updatedTransaction);

            const result = await controller.update(id, updateCreditTransactionDto);

            expect(service.update).toHaveBeenCalledWith(id, updateCreditTransactionDto);
            expect(result).toEqual(updatedTransaction);
        });

        it('should handle not found exception', async () => {
            const id = 999;
            mockCreditTransactionsService.update.mockRejectedValue(new NotFoundException('Credit transaction not found'));

            await expect(controller.update(id, updateCreditTransactionDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete a credit transaction successfully', async () => {
            const id = 1;
            mockCreditTransactionsService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });

        it('should handle not found exception', async () => {
            const id = 999;
            mockCreditTransactionsService.remove.mockRejectedValue(new NotFoundException('Credit transaction not found'));

            await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
        });
    });
}); 