import { Test, TestingModule } from '@nestjs/testing';
import { CouponCurrencyController } from './coupon-currency.controller';
import { CouponCurrencyService } from './coupon-currency.service';
import { CouponCurrencyResponseDto } from './dto/coupon-currency-response.dto';
import { CreateCouponCurrencyDto } from './dto/create-coupon-currency.dto';
import { UpdateCouponCurrencyDto } from './dto/update-coupon-currency.dto';

describe('CouponCurrencyController', () => {
    let controller: CouponCurrencyController;
    let service: CouponCurrencyService;

    const mockCouponCurrencyService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByCouponId: jest.fn(),
        findByCurrencyId: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeByCouponId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CouponCurrencyController],
            providers: [
                {
                    provide: CouponCurrencyService,
                    useValue: mockCouponCurrencyService,
                },
            ],
        }).compile();

        controller = module.get<CouponCurrencyController>(CouponCurrencyController);
        service = module.get<CouponCurrencyService>(CouponCurrencyService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new coupon currency', async () => {
            const createDto: CreateCouponCurrencyDto = {
                currencyId: 1,
                couponId: 1,
                value: 10.50,
            };

            const expectedResponse: CouponCurrencyResponseDto = {
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockCouponCurrencyService.create.mockResolvedValue(expectedResponse);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('findAll', () => {
        it('should return paginated coupon currencies', async () => {
            const expectedResponse = {
                data: [
                    {
                        id: 1,
                        currencyId: 1,
                        couponId: 1,
                        value: 10.50,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockCouponCurrencyService.findAll.mockResolvedValue(expectedResponse);

            const result = await controller.findAll(1, 10, 1, 1);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, 1, 1);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('findByCouponId', () => {
        it('should return coupon currencies by coupon ID', async () => {
            const expectedResponse: CouponCurrencyResponseDto[] = [
                {
                    id: 1,
                    currencyId: 1,
                    couponId: 1,
                    value: 10.50,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockCouponCurrencyService.findByCouponId.mockResolvedValue(expectedResponse);

            const result = await controller.findByCouponId(1);

            expect(service.findByCouponId).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('findByCurrencyId', () => {
        it('should return coupon currencies by currency ID', async () => {
            const expectedResponse: CouponCurrencyResponseDto[] = [
                {
                    id: 1,
                    currencyId: 1,
                    couponId: 1,
                    value: 10.50,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockCouponCurrencyService.findByCurrencyId.mockResolvedValue(expectedResponse);

            const result = await controller.findByCurrencyId(1);

            expect(service.findByCurrencyId).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('findOne', () => {
        it('should return a coupon currency by ID', async () => {
            const expectedResponse: CouponCurrencyResponseDto = {
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockCouponCurrencyService.findOne.mockResolvedValue(expectedResponse);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('update', () => {
        it('should update a coupon currency', async () => {
            const updateDto: UpdateCouponCurrencyDto = {
                value: 15.75,
            };

            const expectedResponse: CouponCurrencyResponseDto = {
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 15.75,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockCouponCurrencyService.update.mockResolvedValue(expectedResponse);

            const result = await controller.update(1, updateDto);

            expect(service.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('remove', () => {
        it('should remove a coupon currency', async () => {
            const expectedResponse = { message: 'Coupon currency deleted successfully' };

            mockCouponCurrencyService.remove.mockResolvedValue(expectedResponse);

            const result = await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedResponse);
        });
    });

    describe('removeByCouponId', () => {
        it('should remove coupon currencies by coupon ID', async () => {
            const expectedResponse = { message: 'Deleted 2 coupon currency records for coupon ID 1' };

            mockCouponCurrencyService.removeByCouponId.mockResolvedValue(expectedResponse);

            const result = await controller.removeByCouponId(1);

            expect(service.removeByCouponId).toHaveBeenCalledWith(1);
            expect(result).toEqual(expectedResponse);
        });
    });
}); 