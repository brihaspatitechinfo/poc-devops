import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

describe('CouponsController', () => {
    let controller: CouponsController;
    let service: CouponsService;

    const mockCouponResponse: CouponResponseDto = {
        id: 1,
        label: 'SUMMER2024',
        code: 'SUMMER24',
        status: 1,
        couponType: 1,
        discountType: 'Percent',
        maximumNumber: 100,
        expiryDate: new Date('2024-12-31'),
        companyDomain: null,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockCouponsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByCode: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        validateCoupon: jest.fn(),
        getActiveCoupons: jest.fn(),
        getExpiredCoupons: jest.fn(),
        getCouponsByType: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CouponsController],
            providers: [
                {
                    provide: CouponsService,
                    useValue: mockCouponsService,
                },
            ],
        }).compile();

        controller = module.get<CouponsController>(CouponsController);
        service = module.get<CouponsService>(CouponsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        const createCouponDto: CreateCouponDto = {
            label: 'SUMMER2024',
            code: 'SUMMER24',
            status: 1,
            couponType: 1,
            discountType: 'Percent',
            maximumNumber: 100,
            expiryDate: '2024-12-31',
            createdBy: 1,
        };

        it('should create a coupon successfully', async () => {
            mockCouponsService.create.mockResolvedValue(mockCouponResponse);

            const result = await controller.create(createCouponDto);

            expect(service.create).toHaveBeenCalledWith(createCouponDto);
            expect(result).toEqual(mockCouponResponse);
        });

        it('should handle service exceptions', async () => {
            mockCouponsService.create.mockRejectedValue(new ConflictException('Coupon code already exists'));

            await expect(controller.create(createCouponDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        const mockPaginatedResponse = {
            data: [mockCouponResponse],
            total: 1,
            page: 1,
            limit: 10,
        };

        it('should return paginated coupons', async () => {
            mockCouponsService.findAll.mockResolvedValue(mockPaginatedResponse);

            const result = await controller.findAll(1, 10, 'SUMMER', 1, 1);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, 'SUMMER', 1, 1);
            expect(result).toEqual(mockPaginatedResponse);
        });

        it('should use default parameters when not provided', async () => {
            mockCouponsService.findAll.mockResolvedValue(mockPaginatedResponse);

            await controller.findAll();

            expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined);
        });
    });

    describe('getActiveCoupons', () => {
        it('should return active coupons', async () => {
            const activeCoupons = [mockCouponResponse];
            mockCouponsService.getActiveCoupons.mockResolvedValue(activeCoupons);

            const result = await controller.getActiveCoupons();

            expect(service.getActiveCoupons).toHaveBeenCalled();
            expect(result).toEqual(activeCoupons);
        });
    });

    describe('getExpiredCoupons', () => {
        it('should return expired coupons', async () => {
            const expiredCoupons = [mockCouponResponse];
            mockCouponsService.getExpiredCoupons.mockResolvedValue(expiredCoupons);

            const result = await controller.getExpiredCoupons();

            expect(service.getExpiredCoupons).toHaveBeenCalled();
            expect(result).toEqual(expiredCoupons);
        });
    });

    describe('getCouponsByType', () => {
        it('should return coupons by type', async () => {
            const couponsByType = [mockCouponResponse];
            mockCouponsService.getCouponsByType.mockResolvedValue(couponsByType);

            const result = await controller.getCouponsByType(1);

            expect(service.getCouponsByType).toHaveBeenCalledWith(1);
            expect(result).toEqual(couponsByType);
        });
    });

    describe('validateCoupon', () => {
        const mockValidationResponse = {
            valid: true,
            message: 'Coupon is valid',
            coupon: mockCouponResponse,
        };

        it('should validate a coupon code', async () => {
            mockCouponsService.validateCoupon.mockResolvedValue(mockValidationResponse);

            const result = await controller.validateCoupon('SUMMER24', 'example.com');

            expect(service.validateCoupon).toHaveBeenCalledWith('SUMMER24', 'example.com');
            expect(result).toEqual(mockValidationResponse);
        });

        it('should validate without user domain', async () => {
            mockCouponsService.validateCoupon.mockResolvedValue(mockValidationResponse);

            const result = await controller.validateCoupon('SUMMER24');

            expect(service.validateCoupon).toHaveBeenCalledWith('SUMMER24', undefined);
            expect(result).toEqual(mockValidationResponse);
        });
    });

    describe('findOne', () => {
        it('should return a coupon by ID', async () => {
            mockCouponsService.findOne.mockResolvedValue(mockCouponResponse);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockCouponResponse);
        });

        it('should handle not found exception', async () => {
            mockCouponsService.findOne.mockRejectedValue(new NotFoundException('Coupon not found'));

            await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByCode', () => {
        it('should return a coupon by code', async () => {
            mockCouponsService.findByCode.mockResolvedValue(mockCouponResponse);

            const result = await controller.findByCode('SUMMER24');

            expect(service.findByCode).toHaveBeenCalledWith('SUMMER24');
            expect(result).toEqual(mockCouponResponse);
        });

        it('should handle not found exception', async () => {
            mockCouponsService.findByCode.mockRejectedValue(new NotFoundException('Coupon not found'));

            await expect(controller.findByCode('INVALID')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        const updateCouponDto: UpdateCouponDto = {
            label: 'WINTER2024',
            status: 0,
        };

        it('should update a coupon successfully', async () => {
            const updatedCoupon = { ...mockCouponResponse, label: 'WINTER2024', status: 0 };
            mockCouponsService.update.mockResolvedValue(updatedCoupon);

            const result = await controller.update(1, updateCouponDto);

            expect(service.update).toHaveBeenCalledWith(1, updateCouponDto);
            expect(result).toEqual(updatedCoupon);
        });

        it('should handle service exceptions', async () => {
            mockCouponsService.update.mockRejectedValue(new NotFoundException('Coupon not found'));

            await expect(controller.update(999, updateCouponDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a coupon successfully', async () => {
            const deleteResponse = { message: 'Coupon deleted successfully' };
            mockCouponsService.remove.mockResolvedValue(deleteResponse);

            const result = await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
            expect(result).toEqual(deleteResponse);
        });

        it('should handle not found exception', async () => {
            mockCouponsService.remove.mockRejectedValue(new NotFoundException('Coupon not found'));

            await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
}); 