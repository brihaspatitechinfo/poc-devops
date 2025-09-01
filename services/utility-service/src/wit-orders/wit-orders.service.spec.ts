import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWitOrderDto } from './dto/create-wit-order.dto';
import { UpdateWitOrderDto } from './dto/update-wit-order.dto';
import { MoneyType, OrderStatus, WitOrder } from './entities/wit-orders.entity';
import { WitOrdersService } from './wit-orders.service';

describe('WitOrdersService', () => {
    let service: WitOrdersService;
    let repository: Repository<WitOrder>;

    const mockWitOrder: WitOrder = {
        id: 1,
        orderNum: 'ORD-2024-001',
        orderId: 'EXT-ORDER-123',
        userId: 'user123',
        currencyId: 1,
        amount: 299.99,
        moneyType: MoneyType.REAL,
        balanceCredit: 500.00,
        moduleType: 'wocademy',
        moduleId: 1,
        status: OrderStatus.PENDING,
        orderMeta: { paymentMethod: 'stripe', transactionId: 'txn_123' },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WitOrdersService,
                {
                    provide: getRepositoryToken(WitOrder),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<WitOrdersService>(WitOrdersService);
        repository = module.get<Repository<WitOrder>>(getRepositoryToken(WitOrder));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createDto: CreateWitOrderDto = {
            orderNum: 'ORD-2024-001',
            orderId: 'EXT-ORDER-123',
            userId: 'user123',
            currencyId: 1,
            amount: 299.99,
            moneyType: MoneyType.REAL,
            balanceCredit: 500.00,
            moduleType: 'wocademy',
            moduleId: 1,
            status: OrderStatus.PENDING,
            orderMeta: { paymentMethod: 'stripe', transactionId: 'txn_123' },
        };

        it('should create a wit order successfully', async () => {
            mockRepository.create.mockReturnValue(mockWitOrder);
            mockRepository.save.mockResolvedValue(mockWitOrder);

            const result = await service.create(createDto);

            expect(repository.create).toHaveBeenCalledWith(createDto);
            expect(repository.save).toHaveBeenCalledWith(mockWitOrder);
            expect(result).toEqual({
                statusCode: 201,
                message: 'Wit order created successfully',
                data: {
                    id: mockWitOrder.id,
                    orderNum: mockWitOrder.orderNum,
                    orderId: mockWitOrder.orderId,
                    userId: mockWitOrder.userId,
                    currencyId: mockWitOrder.currencyId,
                    amount: mockWitOrder.amount,
                    moneyType: mockWitOrder.moneyType,
                    balanceCredit: mockWitOrder.balanceCredit,
                    moduleType: mockWitOrder.moduleType,
                    moduleId: mockWitOrder.moduleId,
                    status: mockWitOrder.status,
                    orderMeta: mockWitOrder.orderMeta,
                    createdAt: mockWitOrder.createdAt,
                    updatedAt: mockWitOrder.updatedAt,
                },
            });
        });

        it('should throw BadRequestException for duplicate order', async () => {
            const duplicateError = { code: 'ER_DUP_ENTRY' };
            mockRepository.create.mockReturnValue(mockWitOrder);
            mockRepository.save.mockRejectedValue(duplicateError);

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException for other errors', async () => {
            const genericError = new Error('Database connection error');
            mockRepository.create.mockReturnValue(mockWitOrder);
            mockRepository.save.mockRejectedValue(genericError);

            await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return all wit orders', async () => {
            const mockOrders = [mockWitOrder];
            mockRepository.find.mockResolvedValue(mockOrders);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                order: { createdAt: 'DESC' }
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: mockWitOrder.id,
                orderNum: mockWitOrder.orderNum,
                orderId: mockWitOrder.orderId,
                userId: mockWitOrder.userId,
                currencyId: mockWitOrder.currencyId,
                amount: mockWitOrder.amount,
                moneyType: mockWitOrder.moneyType,
                balanceCredit: mockWitOrder.balanceCredit,
                moduleType: mockWitOrder.moduleType,
                moduleId: mockWitOrder.moduleId,
                status: mockWitOrder.status,
                orderMeta: mockWitOrder.orderMeta,
                createdAt: mockWitOrder.createdAt,
                updatedAt: mockWitOrder.updatedAt,
            });
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockRepository.find.mockRejectedValue(new Error('Database error'));

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return a wit order by ID', async () => {
            mockRepository.findOne.mockResolvedValue(mockWitOrder);

            const result = await service.findOne(1);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({
                id: mockWitOrder.id,
                orderNum: mockWitOrder.orderNum,
                orderId: mockWitOrder.orderId,
                userId: mockWitOrder.userId,
                currencyId: mockWitOrder.currencyId,
                amount: mockWitOrder.amount,
                moneyType: mockWitOrder.moneyType,
                balanceCredit: mockWitOrder.balanceCredit,
                moduleType: mockWitOrder.moduleType,
                moduleId: mockWitOrder.moduleId,
                status: mockWitOrder.status,
                orderMeta: mockWitOrder.orderMeta,
                createdAt: mockWitOrder.createdAt,
                updatedAt: mockWitOrder.updatedAt,
            });
        });

        it('should throw NotFoundException when order not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for invalid ID', async () => {
            await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
            await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockRepository.findOne.mockRejectedValue(new Error('Database error'));

            await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findByOrderNum', () => {
        it('should return a wit order by order number', async () => {
            mockRepository.findOne.mockResolvedValue(mockWitOrder);

            const result = await service.findByOrderNum('ORD-2024-001');

            expect(repository.findOne).toHaveBeenCalledWith({ where: { orderNum: 'ORD-2024-001' } });
            expect(result).toEqual({
                id: mockWitOrder.id,
                orderNum: mockWitOrder.orderNum,
                orderId: mockWitOrder.orderId,
                userId: mockWitOrder.userId,
                currencyId: mockWitOrder.currencyId,
                amount: mockWitOrder.amount,
                moneyType: mockWitOrder.moneyType,
                balanceCredit: mockWitOrder.balanceCredit,
                moduleType: mockWitOrder.moduleType,
                moduleId: mockWitOrder.moduleId,
                status: mockWitOrder.status,
                orderMeta: mockWitOrder.orderMeta,
                createdAt: mockWitOrder.createdAt,
                updatedAt: mockWitOrder.updatedAt,
            });
        });

        it('should throw NotFoundException when order not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findByOrderNum('INVALID-ORDER')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for invalid order number', async () => {
            await expect(service.findByOrderNum('')).rejects.toThrow(BadRequestException);
            await expect(service.findByOrderNum('   ')).rejects.toThrow(BadRequestException);
        });
    });

    describe('findByUserId', () => {
        it('should return wit orders for a user', async () => {
            const mockOrders = [mockWitOrder];
            mockRepository.find.mockResolvedValue(mockOrders);

            const result = await service.findByUserId('user123');

            expect(repository.find).toHaveBeenCalledWith({
                where: { userId: 'user123' },
                order: { createdAt: 'DESC' }
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: mockWitOrder.id,
                orderNum: mockWitOrder.orderNum,
                orderId: mockWitOrder.orderId,
                userId: mockWitOrder.userId,
                currencyId: mockWitOrder.currencyId,
                amount: mockWitOrder.amount,
                moneyType: mockWitOrder.moneyType,
                balanceCredit: mockWitOrder.balanceCredit,
                moduleType: mockWitOrder.moduleType,
                moduleId: mockWitOrder.moduleId,
                status: mockWitOrder.status,
                orderMeta: mockWitOrder.orderMeta,
                createdAt: mockWitOrder.createdAt,
                updatedAt: mockWitOrder.updatedAt,
            });
        });

        it('should throw BadRequestException for invalid user ID', async () => {
            await expect(service.findByUserId('')).rejects.toThrow(BadRequestException);
            await expect(service.findByUserId('   ')).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        const updateDto: UpdateWitOrderDto = {
            status: OrderStatus.SUCCESS,
            amount: 350.00,
        };

        it('should update a wit order successfully', async () => {
            const updatedOrder = { ...mockWitOrder, ...updateDto };
            mockRepository.findOne.mockResolvedValueOnce(mockWitOrder).mockResolvedValueOnce(updatedOrder);
            mockRepository.update.mockResolvedValue({ affected: 1 });

            const result = await service.update(1, updateDto);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual({
                id: updatedOrder.id,
                orderNum: updatedOrder.orderNum,
                orderId: updatedOrder.orderId,
                userId: updatedOrder.userId,
                currencyId: updatedOrder.currencyId,
                amount: updatedOrder.amount,
                moneyType: updatedOrder.moneyType,
                balanceCredit: updatedOrder.balanceCredit,
                moduleType: updatedOrder.moduleType,
                moduleId: updatedOrder.moduleId,
                status: updatedOrder.status,
                orderMeta: updatedOrder.orderMeta,
                createdAt: updatedOrder.createdAt,
                updatedAt: updatedOrder.updatedAt,
            });
        });

        it('should throw NotFoundException when order not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for invalid ID', async () => {
            await expect(service.update(0, updateDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException for duplicate entry', async () => {
            const duplicateError = { code: 'ER_DUP_ENTRY' };
            mockRepository.findOne.mockResolvedValue(mockWitOrder);
            mockRepository.update.mockRejectedValue(duplicateError);

            await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should delete a wit order successfully', async () => {
            mockRepository.findOne.mockResolvedValue(mockWitOrder);
            mockRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.remove(1);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(repository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual({
                statusCode: 200,
                message: 'Wit order deleted successfully'
            });
        });

        it('should throw NotFoundException when order not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for invalid ID', async () => {
            await expect(service.remove(0)).rejects.toThrow(BadRequestException);
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockRepository.findOne.mockResolvedValue(mockWitOrder);
            mockRepository.delete.mockRejectedValue(new Error('Database error'));

            await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
        });
    });
}); 