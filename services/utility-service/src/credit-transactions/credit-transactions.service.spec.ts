import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditTransactionsService } from './credit-transactions.service';
import { CreateCreditTransactionDto } from './dto/create-credit-transaction.dto';
import { UpdateCreditTransactionDto } from './dto/update-credit-transaction.dto';
import { CreditModule, CreditTransaction } from './entities/credit-transactions.entity';

describe('CreditTransactionsService', () => {
    let service: CreditTransactionsService;
    let repository: Repository<CreditTransaction>;

    const mockCreditTransaction: CreditTransaction = {
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
        updatedAt: new Date(),
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreditTransactionsService,
                {
                    provide: getRepositoryToken(CreditTransaction),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<CreditTransactionsService>(CreditTransactionsService);
        repository = module.get<Repository<CreditTransaction>>(getRepositoryToken(CreditTransaction));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createDto: CreateCreditTransactionDto = {
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
            mockRepository.create.mockReturnValue(mockCreditTransaction);
            mockRepository.save.mockResolvedValue(mockCreditTransaction);

            const result = await service.assignCreditToCorporate(createDto);

            expect(repository.create).toHaveBeenCalledWith(createDto);
            expect(repository.save).toHaveBeenCalledWith(mockCreditTransaction);
            expect(result).toEqual({
                id: mockCreditTransaction.id,
                transferredById: mockCreditTransaction.transferredById,
                transferredToId: mockCreditTransaction.transferredToId,
                actionBy: mockCreditTransaction.actionBy,
                module: mockCreditTransaction.module,
                amount: mockCreditTransaction.amount,
                balanceTransferredBy: mockCreditTransaction.balanceTransferredBy,
                balanceTransferredTo: mockCreditTransaction.balanceTransferredTo,
                remarks: mockCreditTransaction.remarks,
                createdAt: mockCreditTransaction.createdAt,
            });
        });
    });

    describe('findAll', () => {
        it('should return all credit transactions', async () => {
            const mockTransactions = [mockCreditTransaction];
            mockRepository.find.mockResolvedValue(mockTransactions);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                order: { createdAt: 'DESC' }
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: mockCreditTransaction.id,
                transferredById: mockCreditTransaction.transferredById,
                transferredToId: mockCreditTransaction.transferredToId,
                actionBy: mockCreditTransaction.actionBy,
                module: mockCreditTransaction.module,
                amount: mockCreditTransaction.amount,
                balanceTransferredBy: mockCreditTransaction.balanceTransferredBy,
                balanceTransferredTo: mockCreditTransaction.balanceTransferredTo,
                remarks: mockCreditTransaction.remarks,
                createdAt: mockCreditTransaction.createdAt,
            });
        });
    });

    describe('findOne', () => {
        it('should return a credit transaction by ID', async () => {
            mockRepository.findOne.mockResolvedValue(mockCreditTransaction);

            const result = await service.findOne(1);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({
                id: mockCreditTransaction.id,
                transferredById: mockCreditTransaction.transferredById,
                transferredToId: mockCreditTransaction.transferredToId,
                actionBy: mockCreditTransaction.actionBy,
                module: mockCreditTransaction.module,
                amount: mockCreditTransaction.amount,
                balanceTransferredBy: mockCreditTransaction.balanceTransferredBy,
                balanceTransferredTo: mockCreditTransaction.balanceTransferredTo,
                remarks: mockCreditTransaction.remarks,
                createdAt: mockCreditTransaction.createdAt,
            });
        });

        it('should throw NotFoundException when transaction not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByUserId', () => {
        it('should return credit transactions for a user', async () => {
            const mockTransactions = [mockCreditTransaction];
            mockRepository.find.mockResolvedValue(mockTransactions);
            const result = await service.findByUserId('1');
            expect(repository.find).toHaveBeenCalledWith({
                where: [
                    { transferredById: 1 },
                    { transferredToId: 1 }
                ],
                order: { createdAt: 'DESC' }
            });
            expect(result).toHaveLength(1);
        });
    });

    describe('findByModule', () => {
        it('should return credit transactions for a module', async () => {
            const mockTransactions = [mockCreditTransaction];
            mockRepository.find.mockResolvedValue(mockTransactions);

            const result = await service.findByModule(CreditModule.WOCADEMY);

            expect(repository.find).toHaveBeenCalledWith({
                where: { module: CreditModule.WOCADEMY },
                order: { createdAt: 'DESC' }
            });
            expect(result).toHaveLength(1);
        });
    });

    describe('update', () => {
        const updateDto: UpdateCreditTransactionDto = {
            remarks: 'Updated remarks',
        };

        it('should update a credit transaction successfully', async () => {
            const updatedTransaction = { ...mockCreditTransaction, remarks: 'Updated remarks' };
            mockRepository.findOne.mockResolvedValue(mockCreditTransaction);
            mockRepository.save.mockResolvedValue(updatedTransaction);

            const result = await service.update(1, updateDto);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.save).toHaveBeenCalledWith(updatedTransaction);
            expect(result.remarks).toBe('Updated remarks');
        });

        it('should throw NotFoundException when transaction not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should delete a credit transaction successfully', async () => {
            mockRepository.findOne.mockResolvedValue(mockCreditTransaction);
            mockRepository.remove.mockResolvedValue(mockCreditTransaction);

            await service.remove(1);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.remove).toHaveBeenCalledWith(mockCreditTransaction);
        });

        it('should throw NotFoundException when transaction not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getTransactionStats', () => {
        it('should return transaction statistics', async () => {
            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ total: '1000.00' }),
            };

            mockRepository.count.mockResolvedValue(10);
            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.getTransactionStats();

            expect(repository.count).toHaveBeenCalled();
            expect(repository.createQueryBuilder).toHaveBeenCalledWith('transaction');
            expect(result).toEqual({
                totalTransactions: 10,
                totalAmountTransferred: 1000,
                averageTransactionAmount: 100,
            });
        });

        it('should handle zero transactions', async () => {
            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ total: null }),
            };

            mockRepository.count.mockResolvedValue(0);
            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.getTransactionStats();

            expect(result).toEqual({
                totalTransactions: 0,
                totalAmountTransferred: 0,
                averageTransactionAmount: 0,
            });
        });
    });
}); 