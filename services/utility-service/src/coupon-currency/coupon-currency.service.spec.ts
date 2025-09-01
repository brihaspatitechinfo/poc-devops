import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponCurrency } from './coupon-currency.entity';
import { CouponCurrencyService } from './coupon-currency.service';
import { CreateCouponCurrencyDto } from './dto/create-coupon-currency.dto';
import { UpdateCouponCurrencyDto } from './dto/update-coupon-currency.dto';

describe('CouponCurrencyService', () => {
    let service: CouponCurrencyService;
    let repository: Repository<CouponCurrency>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        findAndCount: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponCurrencyService,
                {
                    provide: getRepositoryToken(CouponCurrency),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<CouponCurrencyService>(CouponCurrencyService);
        repository = module.get<Repository<CouponCurrency>>(getRepositoryToken(CouponCurrency));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new coupon currency', async () => {
            const createDto: CreateCouponCurrencyDto = {
                currencyId: 1,
                couponId: 1,
                value: 10.50,
            };

            const mockCouponCurrency = {
                id: 1,
                ...createDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockCouponCurrency);
            mockRepository.save.mockResolvedValue(mockCouponCurrency);

            const result = await service.create(createDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: {
                    couponId: createDto.couponId,
                    currencyId: createDto.currencyId,
                },
            });
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockCouponCurrency);
            expect(result).toEqual({
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                currency: undefined,
                coupon: undefined,
            });
        });

        it('should throw ConflictException if coupon currency combination already exists', async () => {
            const createDto: CreateCouponCurrencyDto = {
                currencyId: 1,
                couponId: 1,
                value: 10.50,
            };

            mockRepository.findOne.mockResolvedValue({ id: 1 });

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return paginated coupon currencies', async () => {
            const mockCouponCurrencies = [
                {
                    id: 1,
                    currencyId: 1,
                    couponId: 1,
                    value: 10.50,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockRepository.findAndCount.mockResolvedValue([mockCouponCurrencies, 1]);

            const result = await service.findAll(1, 10);

            expect(mockRepository.findAndCount).toHaveBeenCalledWith({
                where: {},
                relations: ['currency', 'coupon'],
                skip: 0,
                take: 10,
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual({
                data: expect.arrayContaining([
                    expect.objectContaining({
                        id: 1,
                        currencyId: 1,
                        couponId: 1,
                        value: 10.50,
                    }),
                ]),
                total: 1,
                page: 1,
                limit: 10,
            });
        });
    });

    describe('findOne', () => {
        it('should return a coupon currency by id', async () => {
            const mockCouponCurrency = {
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(mockCouponCurrency);

            const result = await service.findOne(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['currency', 'coupon'],
            });
            expect(result).toEqual({
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                currency: undefined,
                coupon: undefined,
            });
        });

        it('should throw NotFoundException if coupon currency not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a coupon currency', async () => {
            const updateDto: UpdateCouponCurrencyDto = {
                value: 15.75,
            };

            const existingCouponCurrency = {
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedCouponCurrency = {
                ...existingCouponCurrency,
                value: 15.75,
            };

            mockRepository.findOne.mockResolvedValueOnce(existingCouponCurrency);
            mockRepository.findOne.mockResolvedValueOnce(null);
            mockRepository.save.mockResolvedValue(updatedCouponCurrency);

            const result = await service.update(1, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(updatedCouponCurrency);
            expect(result).toEqual({
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 15.75,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                currency: undefined,
                coupon: undefined,
            });
        });

        it('should throw NotFoundException if coupon currency not found', async () => {
            const updateDto: UpdateCouponCurrencyDto = {
                value: 15.75,
            };

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a coupon currency', async () => {
            const mockCouponCurrency = {
                id: 1,
                currencyId: 1,
                couponId: 1,
                value: 10.50,
            };

            mockRepository.findOne.mockResolvedValue(mockCouponCurrency);
            mockRepository.remove.mockResolvedValue(mockCouponCurrency);

            const result = await service.remove(1);

            expect(mockRepository.remove).toHaveBeenCalledWith(mockCouponCurrency);
            expect(result).toEqual({ message: 'Coupon currency deleted successfully' });
        });

        it('should throw NotFoundException if coupon currency not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });
    });
}); 