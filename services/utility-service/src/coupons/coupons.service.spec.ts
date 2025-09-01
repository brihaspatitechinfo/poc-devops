import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupons.entity';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

describe('CouponsService', () => {
    let service: CouponsService;
    let repository: Repository<Coupon>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findAndCount: jest.fn(),
        remove: jest.fn(),
        find: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn(),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponsService,
                {
                    provide: getRepositoryToken(Coupon),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<CouponsService>(CouponsService);
        repository = module.get<Repository<Coupon>>(getRepositoryToken(Coupon));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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

        const mockCoupon: Coupon = {
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

        it('should create a coupon successfully', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockCoupon);
            mockRepository.save.mockResolvedValue(mockCoupon);

            const result = await service.create(createCouponDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { code: createCouponDto.code }
            });
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createCouponDto,
                expiryDate: new Date(createCouponDto.expiryDate),
            });
            expect(mockRepository.save).toHaveBeenCalledWith(mockCoupon);
            expect(result).toEqual({
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
            });
        });

        it('should throw ConflictException if coupon code already exists', async () => {
            mockRepository.findOne.mockResolvedValue(mockCoupon);

            await expect(service.create(createCouponDto)).rejects.toThrow(ConflictException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { code: createCouponDto.code }
            });
        });

        it('should throw BadRequestException if expiry date is in the past', async () => {
            const pastDateDto = { ...createCouponDto, expiryDate: '2020-01-01' };
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.create(pastDateDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        const mockCoupons = [
            {
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
            },
        ];

        it('should return paginated coupons', async () => {
            mockRepository.findAndCount.mockResolvedValue([mockCoupons, 1]);

            const result = await service.findAll(1, 10);

            expect(mockRepository.findAndCount).toHaveBeenCalledWith({
                where: {},
                skip: 0,
                take: 10,
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual({
                data: mockCoupons.map(coupon => ({
                    id: coupon.id,
                    label: coupon.label,
                    code: coupon.code,
                    status: coupon.status,
                    couponType: coupon.couponType,
                    discountType: coupon.discountType,
                    maximumNumber: coupon.maximumNumber,
                    expiryDate: coupon.expiryDate,
                    companyDomain: coupon.companyDomain,
                    createdBy: coupon.createdBy,
                    createdAt: coupon.createdAt,
                    updatedAt: coupon.updatedAt,
                })),
                total: 1,
                page: 1,
                limit: 10,
            });
        });

        it('should apply search filter', async () => {
            mockRepository.findAndCount.mockResolvedValue([mockCoupons, 1]);

            await service.findAll(1, 10, 'SUMMER');

            expect(mockRepository.findAndCount).toHaveBeenCalledWith({
                where: { label: expect.any(Object) },
                skip: 0,
                take: 10,
                order: { createdAt: 'DESC' },
            });
        });
    });

    describe('findOne', () => {
        const mockCoupon = {
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

        it('should return a coupon by ID', async () => {
            mockRepository.findOne.mockResolvedValue(mockCoupon);

            const result = await service.findOne(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(result).toEqual({
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
            });
        });

        it('should throw NotFoundException if coupon not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        const updateCouponDto: UpdateCouponDto = {
            label: 'WINTER2024',
            status: 0,
        };

        const existingCoupon = {
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

        it('should update a coupon successfully', async () => {
            mockRepository.findOne
                .mockResolvedValueOnce(existingCoupon) // First call for finding existing coupon
                .mockResolvedValueOnce(null); // Second call for checking code uniqueness
            mockRepository.save.mockResolvedValue({ ...existingCoupon, ...updateCouponDto });

            const result = await service.update(1, updateCouponDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result.label).toBe('WINTER2024');
        });

        it('should throw NotFoundException if coupon not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateCouponDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        const mockCoupon = {
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

        it('should remove a coupon successfully', async () => {
            mockRepository.findOne.mockResolvedValue(mockCoupon);
            mockRepository.remove.mockResolvedValue(mockCoupon);

            const result = await service.remove(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 }
            });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockCoupon);
            expect(result).toEqual({ message: 'Coupon deleted successfully' });
        });

        it('should throw NotFoundException if coupon not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('validateCoupon', () => {
        const validCoupon = {
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

        it('should validate a valid coupon', async () => {
            mockRepository.findOne.mockResolvedValue(validCoupon);

            const result = await service.validateCoupon('SUMMER24');

            expect(result).toEqual({
                valid: true,
                message: 'Coupon is valid',
                coupon: {
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
                },
            });
        });

        it('should return invalid for non-existent coupon', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result = await service.validateCoupon('INVALID');

            expect(result).toEqual({
                valid: false,
                message: 'Invalid coupon code',
            });
        });

        it('should return invalid for inactive coupon', async () => {
            const inactiveCoupon = { ...validCoupon, status: 0 };
            mockRepository.findOne.mockResolvedValue(inactiveCoupon);

            const result = await service.validateCoupon('SUMMER24');

            expect(result).toEqual({
                valid: false,
                message: 'Coupon is inactive',
            });
        });

        it('should return invalid for expired coupon', async () => {
            const expiredCoupon = { ...validCoupon, expiryDate: new Date('2020-01-01') };
            mockRepository.findOne.mockResolvedValue(expiredCoupon);

            const result = await service.validateCoupon('SUMMER24');

            expect(result).toEqual({
                valid: false,
                message: 'Coupon has expired',
            });
        });
    });
}); 