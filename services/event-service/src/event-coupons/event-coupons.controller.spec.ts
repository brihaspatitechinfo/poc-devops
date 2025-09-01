import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventCouponDto } from './dto/create-event-coupon.dto';
import { UpdateEventCouponDto } from './dto/update-event-coupon.dto';
import { EventCoupon } from './entities/event-coupon.entity';
import { EventCouponsController } from './event-coupons.controller';
import { EventCouponsService } from './event-coupons.service';

describe('EventCouponsController', () => {
    let controller: EventCouponsController;
    let service: EventCouponsService;

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

    const mockEventCouponsService = {
        create: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn(),
        findByEventId: jest.fn(),
        findByCouponId: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeByEventId: jest.fn(),
        removeByCouponId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventCouponsController],
            providers: [
                {
                    provide: EventCouponsService,
                    useValue: mockEventCouponsService,
                },
            ],
        }).compile();

        controller = module.get<EventCouponsController>(EventCouponsController);
        service = module.get<EventCouponsService>(EventCouponsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event coupon successfully', async () => {
            mockEventCouponsService.create.mockResolvedValue(mockEventCoupon);

            const result = await controller.create(mockCreateEventCouponDto);

            expect(service.create).toHaveBeenCalledWith(mockCreateEventCouponDto);
            expect(result).toEqual(mockEventCoupon);
        });

        it('should handle service errors when creating event coupon', async () => {
            const errorMessage = 'Database connection failed';
            mockEventCouponsService.create.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.create(mockCreateEventCouponDto)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.create).toHaveBeenCalledWith(mockCreateEventCouponDto);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event coupons successfully', async () => {
            const mockCoupons = [mockCreateEventCouponDto, { eventId: 2, couponId: 2 }];
            const mockCreatedCoupons = [mockEventCoupon, { ...mockEventCoupon, id: 2, eventId: 2, couponId: 2 }];

            mockEventCouponsService.bulkCreate.mockResolvedValue(mockCreatedCoupons);

            const result = await controller.bulkCreate(mockCoupons);

            expect(service.bulkCreate).toHaveBeenCalledWith(mockCoupons);
            expect(result).toEqual(mockCreatedCoupons);
        });

        it('should handle service errors when bulk creating event coupons', async () => {
            const mockCoupons = [mockCreateEventCouponDto];
            const errorMessage = 'Bulk creation failed';
            mockEventCouponsService.bulkCreate.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.bulkCreate(mockCoupons)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.bulkCreate).toHaveBeenCalledWith(mockCoupons);
        });
    });

    describe('findAll', () => {
        it('should return all event coupons successfully', async () => {
            const mockEventCoupons = [mockEventCoupon, { ...mockEventCoupon, id: 2 }];
            mockEventCouponsService.findAll.mockResolvedValue(mockEventCoupons);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockEventCoupons);
        });

        it('should return empty array when no event coupons exist', async () => {
            mockEventCouponsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it('should handle service errors when fetching all event coupons', async () => {
            const errorMessage = 'Database query failed';
            mockEventCouponsService.findAll.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.findAll()).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findByEventId', () => {
        it('should return event coupons by event ID successfully', async () => {
            const eventId = 1;
            const mockEventCoupons = [mockEventCoupon];
            mockEventCouponsService.findByEventId.mockResolvedValue(mockEventCoupons);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(mockEventCoupons);
        });

        it('should return empty array when no event coupons found for event ID', async () => {
            const eventId = 999;
            mockEventCouponsService.findByEventId.mockResolvedValue([]);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual([]);
        });

        it('should handle service errors when fetching by event ID', async () => {
            const eventId = 1;
            const errorMessage = 'Event ID query failed';
            mockEventCouponsService.findByEventId.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.findByEventId(eventId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
        });
    });

    describe('findByCouponId', () => {
        it('should return event coupons by coupon ID successfully', async () => {
            const couponId = 1;
            const mockEventCoupons = [mockEventCoupon];
            mockEventCouponsService.findByCouponId.mockResolvedValue(mockEventCoupons);

            const result = await controller.findByCouponId(couponId);

            expect(service.findByCouponId).toHaveBeenCalledWith(couponId);
            expect(result).toEqual(mockEventCoupons);
        });

        it('should return empty array when no event coupons found for coupon ID', async () => {
            const couponId = 999;
            mockEventCouponsService.findByCouponId.mockResolvedValue([]);

            const result = await controller.findByCouponId(couponId);

            expect(service.findByCouponId).toHaveBeenCalledWith(couponId);
            expect(result).toEqual([]);
        });

        it('should handle service errors when fetching by coupon ID', async () => {
            const couponId = 1;
            const errorMessage = 'Coupon ID query failed';
            mockEventCouponsService.findByCouponId.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.findByCouponId(couponId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.findByCouponId).toHaveBeenCalledWith(couponId);
        });
    });

    describe('findOne', () => {
        it('should return event coupon by ID successfully', async () => {
            const id = 1;
            mockEventCouponsService.findOne.mockResolvedValue(mockEventCoupon);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockEventCoupon);
        });

        it('should handle not found error when event coupon does not exist', async () => {
            const id = 999;
            mockEventCouponsService.findOne.mockRejectedValue(
                new NotFoundException(`Event coupon with ID ${id} not found`)
            );

            await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
            expect(service.findOne).toHaveBeenCalledWith(id);
        });

        it('should handle service errors when fetching by ID', async () => {
            const id = 1;
            const errorMessage = 'ID query failed';
            mockEventCouponsService.findOne.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.findOne(id)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.findOne).toHaveBeenCalledWith(id);
        });
    });

    describe('update', () => {
        it('should update event coupon successfully', async () => {
            const id = 1;
            const updatedEventCoupon = { ...mockEventCoupon, eventId: 2 };
            mockEventCouponsService.update.mockResolvedValue(updatedEventCoupon);

            const result = await controller.update(id, mockUpdateEventCouponDto);

            expect(service.update).toHaveBeenCalledWith(id, mockUpdateEventCouponDto);
            expect(result).toEqual(updatedEventCoupon);
        });

        it('should handle not found error when updating non-existent event coupon', async () => {
            const id = 999;
            mockEventCouponsService.update.mockRejectedValue(
                new NotFoundException(`Event coupon with ID ${id} not found`)
            );

            await expect(controller.update(id, mockUpdateEventCouponDto)).rejects.toThrow(
                NotFoundException
            );
            expect(service.update).toHaveBeenCalledWith(id, mockUpdateEventCouponDto);
        });

        it('should handle service errors when updating event coupon', async () => {
            const id = 1;
            const errorMessage = 'Update operation failed';
            mockEventCouponsService.update.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.update(id, mockUpdateEventCouponDto)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.update).toHaveBeenCalledWith(id, mockUpdateEventCouponDto);
        });
    });

    describe('remove', () => {
        it('should remove event coupon successfully', async () => {
            const id = 1;
            mockEventCouponsService.remove.mockResolvedValue(undefined);

            const result = await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
            expect(result).toBeUndefined();
        });

        it('should handle not found error when removing non-existent event coupon', async () => {
            const id = 999;
            mockEventCouponsService.remove.mockRejectedValue(
                new NotFoundException(`Event coupon with ID ${id} not found`)
            );

            await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
            expect(service.remove).toHaveBeenCalledWith(id);
        });

        it('should handle service errors when removing event coupon', async () => {
            const id = 1;
            const errorMessage = 'Remove operation failed';
            mockEventCouponsService.remove.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.remove(id)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('removeByEventId', () => {
        it('should remove event coupons by event ID successfully', async () => {
            const eventId = 1;
            mockEventCouponsService.removeByEventId.mockResolvedValue(undefined);

            const result = await controller.removeByEventId(eventId);

            expect(service.removeByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toBeUndefined();
        });

        it('should handle service errors when removing by event ID', async () => {
            const eventId = 1;
            const errorMessage = 'Remove by event ID failed';
            mockEventCouponsService.removeByEventId.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.removeByEventId(eventId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.removeByEventId).toHaveBeenCalledWith(eventId);
        });
    });

    describe('removeByCouponId', () => {
        it('should remove event coupons by coupon ID successfully', async () => {
            const couponId = 1;
            mockEventCouponsService.removeByCouponId.mockResolvedValue(undefined);

            const result = await controller.removeByCouponId(couponId);

            expect(service.removeByCouponId).toHaveBeenCalledWith(couponId);
            expect(result).toBeUndefined();
        });

        it('should handle service errors when removing by coupon ID', async () => {
            const couponId = 1;
            const errorMessage = 'Remove by coupon ID failed';
            mockEventCouponsService.removeByCouponId.mockRejectedValue(
                new InternalServerErrorException(errorMessage)
            );

            await expect(controller.removeByCouponId(couponId)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(service.removeByCouponId).toHaveBeenCalledWith(couponId);
        });
    });
}); 