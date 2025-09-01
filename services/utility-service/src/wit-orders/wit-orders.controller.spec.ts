import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateWitOrderDto } from './dto/create-wit-order.dto';
import { UpdateWitOrderDto } from './dto/update-wit-order.dto';
import { WitOrderResponseDto } from './dto/wit-order-response.dto';
import { MoneyType, OrderStatus } from './entities/wit-orders.entity';
import { WitOrdersController } from './wit-orders.controller';
import { WitOrdersService } from './wit-orders.service';

describe('WitOrdersController', () => {
    let controller: WitOrdersController;
    let service: WitOrdersService;

    const mockWitOrderResponse: WitOrderResponseDto = {
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

    const mockWitOrdersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByOrderNum: jest.fn(),
        findByUserId: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WitOrdersController],
            providers: [
                {
                    provide: WitOrdersService,
                    useValue: mockWitOrdersService,
                },
            ],
        }).compile();

        controller = module.get<WitOrdersController>(WitOrdersController);
        service = module.get<WitOrdersService>(WitOrdersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        const createWitOrderDto: CreateWitOrderDto = {
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
            const expectedResponse = {
                statusCode: 201,
                message: 'Wit order created successfully',
                data: mockWitOrderResponse
            };
            mockWitOrdersService.create.mockResolvedValue(expectedResponse);

            const result = await controller.create(createWitOrderDto);

            expect(service.create).toHaveBeenCalledWith(createWitOrderDto);
            expect(result).toEqual(expectedResponse);
        });

        it('should handle BadRequestException for duplicate order', async () => {
            mockWitOrdersService.create.mockRejectedValue(new BadRequestException('Order with this order number already exists'));

            await expect(controller.create(createWitOrderDto)).rejects.toThrow(BadRequestException);
            expect(service.create).toHaveBeenCalledWith(createWitOrderDto);
        });
    });

    describe('findAll', () => {
        it('should return all wit orders', async () => {
            const mockOrders = [mockWitOrderResponse];
            mockWitOrdersService.findAll.mockResolvedValue(mockOrders);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockOrders);
        });

        it('should return empty array when no orders exist', async () => {
            mockWitOrdersService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a wit order by ID', async () => {
            mockWitOrdersService.findOne.mockResolvedValue(mockWitOrderResponse);

            const result = await controller.findOne('1');

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockWitOrderResponse);
        });

        it('should handle NotFoundException when order not found', async () => {
            mockWitOrdersService.findOne.mockRejectedValue(new NotFoundException('Wit order with ID 999 not found'));

            await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(999);
        });

        it('should handle BadRequestException for invalid ID', async () => {
            mockWitOrdersService.findOne.mockRejectedValue(new BadRequestException('Invalid order ID provided'));

            await expect(controller.findOne('0')).rejects.toThrow(BadRequestException);
            expect(service.findOne).toHaveBeenCalledWith(0);
        });
    });

    describe('findByOrderNum', () => {
        it('should return a wit order by order number', async () => {
            mockWitOrdersService.findByOrderNum.mockResolvedValue(mockWitOrderResponse);

            const result = await controller.findByOrderNum('ORD-2024-001');

            expect(service.findByOrderNum).toHaveBeenCalledWith('ORD-2024-001');
            expect(result).toEqual(mockWitOrderResponse);
        });

        it('should handle NotFoundException when order not found', async () => {
            mockWitOrdersService.findByOrderNum.mockRejectedValue(new NotFoundException('Wit order with order number INVALID-ORDER not found'));

            await expect(controller.findByOrderNum('INVALID-ORDER')).rejects.toThrow(NotFoundException);
            expect(service.findByOrderNum).toHaveBeenCalledWith('INVALID-ORDER');
        });

        it('should handle BadRequestException for invalid order number', async () => {
            mockWitOrdersService.findByOrderNum.mockRejectedValue(new BadRequestException('Invalid order number provided'));

            await expect(controller.findByOrderNum('')).rejects.toThrow(BadRequestException);
            expect(service.findByOrderNum).toHaveBeenCalledWith('');
        });
    });

    describe('findByUserId', () => {
        it('should return wit orders for a user', async () => {
            const mockOrders = [mockWitOrderResponse];
            mockWitOrdersService.findByUserId.mockResolvedValue(mockOrders);

            const result = await controller.findByUserId('user123');

            expect(service.findByUserId).toHaveBeenCalledWith('user123');
            expect(result).toEqual(mockOrders);
        });

        it('should return empty array when user has no orders', async () => {
            mockWitOrdersService.findByUserId.mockResolvedValue([]);

            const result = await controller.findByUserId('user456');

            expect(service.findByUserId).toHaveBeenCalledWith('user456');
            expect(result).toEqual([]);
        });

        it('should handle BadRequestException for invalid user ID', async () => {
            mockWitOrdersService.findByUserId.mockRejectedValue(new BadRequestException('Invalid user ID provided'));

            await expect(controller.findByUserId('')).rejects.toThrow(BadRequestException);
            expect(service.findByUserId).toHaveBeenCalledWith('');
        });
    });

    describe('update', () => {
        const updateWitOrderDto: UpdateWitOrderDto = {
            status: OrderStatus.SUCCESS,
            amount: 350.00,
        };

        it('should update a wit order successfully', async () => {
            const updatedOrder = { ...mockWitOrderResponse, ...updateWitOrderDto };
            mockWitOrdersService.update.mockResolvedValue(updatedOrder);

            const result = await controller.update('1', updateWitOrderDto);

            expect(service.update).toHaveBeenCalledWith(1, updateWitOrderDto);
            expect(result).toEqual(updatedOrder);
        });

        it('should handle NotFoundException when order not found', async () => {
            mockWitOrdersService.update.mockRejectedValue(new NotFoundException('Wit order with ID 999 not found'));

            await expect(controller.update('999', updateWitOrderDto)).rejects.toThrow(NotFoundException);
            expect(service.update).toHaveBeenCalledWith(999, updateWitOrderDto);
        });

        it('should handle BadRequestException for invalid ID', async () => {
            mockWitOrdersService.update.mockRejectedValue(new BadRequestException('Invalid order ID provided'));

            await expect(controller.update('0', updateWitOrderDto)).rejects.toThrow(BadRequestException);
            expect(service.update).toHaveBeenCalledWith(0, updateWitOrderDto);
        });

        it('should handle BadRequestException for duplicate entry', async () => {
            mockWitOrdersService.update.mockRejectedValue(new BadRequestException('Order with this order number already exists'));

            await expect(controller.update('1', { orderNum: 'DUPLICATE-ORDER' })).rejects.toThrow(BadRequestException);
            expect(service.update).toHaveBeenCalledWith(1, { orderNum: 'DUPLICATE-ORDER' });
        });
    });

    describe('remove', () => {
        it('should delete a wit order successfully', async () => {
            const expectedResponse = {
                statusCode: 200,
                message: 'Wit order deleted successfully'
            };
            mockWitOrdersService.remove.mockResolvedValue(expectedResponse);

            const result = await controller.remove('1');

            expect(service.remove).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedResponse);
        });

        it('should handle NotFoundException when order not found', async () => {
            mockWitOrdersService.remove.mockRejectedValue(new NotFoundException('Wit order with ID 999 not found'));

            await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
            expect(service.remove).toHaveBeenCalledWith(999);
        });

        it('should handle BadRequestException for invalid ID', async () => {
            mockWitOrdersService.remove.mockRejectedValue(new BadRequestException('Invalid order ID provided'));

            await expect(controller.remove('0')).rejects.toThrow(BadRequestException);
            expect(service.remove).toHaveBeenCalledWith(0);
        });
    });

    describe('edge cases and error scenarios', () => {
        it('should handle service errors gracefully in create', async () => {
            const createDto: CreateWitOrderDto = {
                orderNum: 'ORD-2024-001',
                userId: 'user123',
                currencyId: 1,
                amount: 299.99,
                moneyType: MoneyType.REAL,
                balanceCredit: 500.00,
                moduleType: 'wocademy',
                moduleId: 1,
            };

            mockWitOrdersService.create.mockRejectedValue(new Error('Unexpected error'));

            await expect(controller.create(createDto)).rejects.toThrow('Unexpected error');
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle large numbers correctly', async () => {
            const largeAmountDto: CreateWitOrderDto = {
                orderNum: 'ORD-2024-002',
                userId: 'user123',
                currencyId: 1,
                amount: 99999999.99,
                moneyType: MoneyType.REAL,
                balanceCredit: 99999999.99,
                moduleType: 'wocademy',
                moduleId: 1,
            };

            const expectedResponse = {
                statusCode: 201,
                message: 'Wit order created successfully',
                data: { ...mockWitOrderResponse, amount: 99999999.99, balanceCredit: 99999999.99 }
            };

            mockWitOrdersService.create.mockResolvedValue(expectedResponse);

            const result = await controller.create(largeAmountDto);

            expect(service.create).toHaveBeenCalledWith(largeAmountDto);
            expect(result).toEqual(expectedResponse);
        });

        it('should handle special characters in order metadata', async () => {
            const specialMetaDto: CreateWitOrderDto = {
                orderNum: 'ORD-2024-003',
                userId: 'user123',
                currencyId: 1,
                amount: 100.00,
                moneyType: MoneyType.REAL,
                balanceCredit: 500.00,
                moduleType: 'wocademy',
                moduleId: 1,
                orderMeta: {
                    specialChars: 'Test with special chars: àáâãäåæçèéêë',
                    unicode: '🚀💰🎯',
                    numbers: 12345,
                    nested: { deep: { value: 'test' } }
                },
            };

            const expectedResponse = {
                statusCode: 201,
                message: 'Wit order created successfully',
                data: { ...mockWitOrderResponse, orderMeta: specialMetaDto.orderMeta }
            };

            mockWitOrdersService.create.mockResolvedValue(expectedResponse);

            const result = await controller.create(specialMetaDto);

            expect(service.create).toHaveBeenCalledWith(specialMetaDto);
            expect(result).toEqual(expectedResponse);
        });
    });
}); 