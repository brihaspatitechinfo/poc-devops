import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventCouponDto } from './dto/create-event-coupon.dto';
import { UpdateEventCouponDto } from './dto/update-event-coupon.dto';
import { EventCoupon } from './entities/event-coupon.entity';
import { EventCouponsService } from './event-coupons.service';

describe('EventCouponsService', () => {
    let service: EventCouponsService;
    let repository: Repository<EventCoupon>;

    const mockEventCoupon: EventCoupon = {
        id: 1,
        eventId: 1,
        couponId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockCreateEventCouponDto: CreateEventCouponDto = {
        eventId: 1,
        couponId: 1,
    };

    const mockUpdateEventCouponDto: UpdateEventCouponDto = {
        eventId: 2,
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        softRemove: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventCouponsService,
                {
                    provide: getRepositoryToken(EventCoupon),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventCouponsService>(EventCouponsService);
        repository = module.get<Repository<EventCoupon>>(getRepositoryToken(EventCoupon));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event coupon successfully', async () => {
            mockRepository.create.mockReturnValue(mockEventCoupon);
            mockRepository.save.mockResolvedValue(mockEventCoupon);

            const result = await service.create(mockCreateEventCouponDto);

            expect(repository.create).toHaveBeenCalledWith(mockCreateEventCouponDto);
            expect(repository.save).toHaveBeenCalledWith(mockEventCoupon);
            expect(result).toEqual(mockEventCoupon);
        });

        it('should handle database errors when creating event coupon', async () => {
            const errorMessage = 'Database connection failed';
            mockRepository.create.mockReturnValue(mockEventCoupon);
            mockRepository.save.mockRejectedValue(new Error(errorMessage));

            await expect(service.create(mockCreateEventCouponDto)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(repository.create).toHaveBeenCalledWith(mockCreateEventCouponDto);
            expect(repository.save).toHaveBeenCalledWith(mockEventCoupon);
        });
    });

    describe('findAll', () => {
        it('should return all event coupons successfully', async () => {
            const mockEventCoupons = [mockEventCoupon, { ...mockEventCoupon, id: 2 }];
            mockRepository.find.mockResolvedValue(mockEventCoupons);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalled();
            expect(result).toEqual(mockEventCoupons);
        });

        it('should return empty array when no event coupons exist', async () => {
            mockRepository.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it('should handle database errors when fetching all event coupons', async () => {
            const errorMessage = 'Database query failed';
            mockRepository.find.mockRejectedValue(new Error(errorMessage));

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findByEventId', () => {
        it('should return event coupons by event ID successfully', async () => {
            const eventId = 1;
            const mockEventCoupons = [mockEventCoupon];
            mockRepository.find.mockResolvedValue(mockEventCoupons);

            const result = await service.findByEventId(eventId);

            expect(repository.find).toHaveBeenCalledWith({ where: { eventId } });
            expect(result).toEqual(mockEventCoupons);
        });

        it('should return empty array when no event coupons found for event ID', async () => {
            const eventId = 999;
            mockRepository.find.mockResolvedValue([]);

            const result = await service.findByEventId(eventId);

            expect(repository.find).toHaveBeenCalledWith({ where: { eventId } });
            expect(result).toEqual([]);
        });

        it('should handle database errors when fetching by event ID', async () => {
            const eventId = 1;
            const errorMessage = 'Event ID query failed';
            mockRepository.find.mockRejectedValue(new Error(errorMessage));

            await expect(service.findByEventId(eventId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(repository.find).toHaveBeenCalledWith({ where: { eventId } });
        });
    });

    describe('findByCouponId', () => {
        it('should return event coupons by coupon ID successfully', async () => {
            const couponId = 1;
            const mockEventCoupons = [mockEventCoupon];
            mockRepository.find.mockResolvedValue(mockEventCoupons);

            const result = await service.findByCouponId(couponId);

            expect(repository.find).toHaveBeenCalledWith({ where: { couponId } });
            expect(result).toEqual(mockEventCoupons);
        });

        it('should return empty array when no event coupons found for coupon ID', async () => {
            const couponId = 999;
            mockRepository.find.mockResolvedValue([]);

            const result = await service.findByCouponId(couponId);

            expect(repository.find).toHaveBeenCalledWith({ where: { couponId } });
            expect(result).toEqual([]);
        });

        it('should handle database errors when fetching by coupon ID', async () => {
            const couponId = 1;
            const errorMessage = 'Coupon ID query failed';
            mockRepository.find.mockRejectedValue(new Error(errorMessage));

            await expect(service.findByCouponId(couponId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(repository.find).toHaveBeenCalledWith({ where: { couponId } });
        });
    });

    describe('findOne', () => {
        it('should return event coupon by ID successfully', async () => {
            const id = 1;
            mockRepository.findOne.mockResolvedValue(mockEventCoupon);

            const result = await service.findOne(id);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(result).toEqual(mockEventCoupon);
        });

        it('should throw NotFoundException when event coupon does not exist', async () => {
            const id = 999;
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(
                new NotFoundException(`Event coupon with ID ${id} not found`)
            );
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
        });

        it('should handle database errors when fetching by ID', async () => {
            const id = 1;
            const errorMessage = 'ID query failed';
            mockRepository.findOne.mockRejectedValue(new Error(errorMessage));

            await expect(service.findOne(id)).rejects.toThrow(InternalServerErrorException);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
        });
    });

    describe('update', () => {
        it('should update event coupon successfully', async () => {
            const id = 1;
            const updatedEventCoupon = { ...mockEventCoupon, eventId: 2 };

            // Mock findOne to return existing event coupon
            jest.spyOn(service, 'findOne').mockResolvedValue(mockEventCoupon);
            mockRepository.save.mockResolvedValue(updatedEventCoupon);

            const result = await service.update(id, mockUpdateEventCouponDto);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(repository.save).toHaveBeenCalledWith(updatedEventCoupon);
            expect(result).toEqual(updatedEventCoupon);
        });

        it('should throw NotFoundException when updating non-existent event coupon', async () => {
            const id = 999;
            jest.spyOn(service, 'findOne').mockRejectedValue(
                new NotFoundException(`Event coupon with ID ${id} not found`)
            );

            await expect(service.update(id, mockUpdateEventCouponDto)).rejects.toThrow(
                NotFoundException
            );
            expect(service.findOne).toHaveBeenCalledWith(id);
        });

        it('should handle database errors when updating event coupon', async () => {
            const id = 1;
            const errorMessage = 'Update operation failed';

            jest.spyOn(service, 'findOne').mockResolvedValue(mockEventCoupon);
            mockRepository.save.mockRejectedValue(new Error(errorMessage));

            await expect(service.update(id, mockUpdateEventCouponDto)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(repository.save).toHaveBeenCalledWith(mockEventCoupon);
        });
    });

    describe('remove', () => {
        it('should remove event coupon successfully', async () => {
            const id = 1;
            jest.spyOn(service, 'findOne').mockResolvedValue(mockEventCoupon);
            mockRepository.softRemove.mockResolvedValue(mockEventCoupon);

            await service.remove(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(repository.softRemove).toHaveBeenCalledWith(mockEventCoupon);
        });

        it('should throw NotFoundException when removing non-existent event coupon', async () => {
            const id = 999;
            jest.spyOn(service, 'findOne').mockRejectedValue(
                new NotFoundException(`Event coupon with ID ${id} not found`)
            );

            await expect(service.remove(id)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });

        it('should handle database errors when removing event coupon', async () => {
            const id = 1;
            const errorMessage = 'Remove operation failed';

            jest.spyOn(service, 'findOne').mockResolvedValue(mockEventCoupon);
            mockRepository.softRemove.mockRejectedValue(new Error(errorMessage));

            await expect(service.remove(id)).rejects.toThrow(InternalServerErrorException);
            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(repository.softRemove).toHaveBeenCalledWith(mockEventCoupon);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event coupons successfully', async () => {
            const mockCoupons = [mockCreateEventCouponDto, { eventId: 2, couponId: 2 }];
            const mockCreatedCoupons = [mockEventCoupon, { ...mockEventCoupon, id: 2, eventId: 2, couponId: 2 }];

            mockRepository.create.mockReturnValue(mockCreatedCoupons);
            mockRepository.save.mockResolvedValue(mockCreatedCoupons);

            const result = await service.bulkCreate(mockCoupons);

            expect(repository.create).toHaveBeenCalledWith(mockCoupons);
            expect(repository.save).toHaveBeenCalledWith(mockCreatedCoupons);
            expect(result).toEqual(mockCreatedCoupons);
        });

        it('should handle database errors when bulk creating event coupons', async () => {
            const mockCoupons = [mockCreateEventCouponDto];
            const errorMessage = 'Bulk creation failed';

            mockRepository.create.mockReturnValue([mockEventCoupon]);
            mockRepository.save.mockRejectedValue(new Error(errorMessage));

            await expect(service.bulkCreate(mockCoupons)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(repository.create).toHaveBeenCalledWith(mockCoupons);
            expect(repository.save).toHaveBeenCalledWith([mockEventCoupon]);
        });
    });

    describe('removeByEventId', () => {
        it('should remove event coupons by event ID successfully', async () => {
            const eventId = 1;
            mockRepository.softDelete.mockResolvedValue({ affected: 2 });

            await service.removeByEventId(eventId);

            expect(repository.softDelete).toHaveBeenCalledWith({ eventId });
        });

        it('should handle database errors when removing by event ID', async () => {
            const eventId = 1;
            const errorMessage = 'Remove by event ID failed';
            mockRepository.softDelete.mockRejectedValue(new Error(errorMessage));

            await expect(service.removeByEventId(eventId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(repository.softDelete).toHaveBeenCalledWith({ eventId });
        });
    });

    describe('removeByCouponId', () => {
        it('should remove event coupons by coupon ID successfully', async () => {
            const couponId = 1;
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.removeByCouponId(couponId);

            expect(repository.softDelete).toHaveBeenCalledWith({ couponId });
        });

        it('should handle database errors when removing by coupon ID', async () => {
            const couponId = 1;
            const errorMessage = 'Remove by coupon ID failed';
            mockRepository.softDelete.mockRejectedValue(new Error(errorMessage));

            await expect(service.removeByCouponId(couponId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(repository.softDelete).toHaveBeenCalledWith({ couponId });
        });
    });

    describe('error handling', () => {
        it('should preserve NotFoundException when thrown by findOne', async () => {
            const id = 999;
            const notFoundError = new NotFoundException(`Event coupon with ID ${id} not found`);

            jest.spyOn(service, 'findOne').mockRejectedValue(notFoundError);

            await expect(service.update(id, mockUpdateEventCouponDto)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });

        it('should preserve NotFoundException when thrown by remove', async () => {
            const id = 999;
            const notFoundError = new NotFoundException(`Event coupon with ID ${id} not found`);

            jest.spyOn(service, 'findOne').mockRejectedValue(notFoundError);

            await expect(service.remove(id)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });
}); 