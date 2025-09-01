import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventLocationsDto } from './dto/create-event-locations.dto';
import { UpdateEventLocationsDto } from './dto/update-event-locations.dto';
import { EventLocations } from './entities/event-locations.entity';
import { EventLocationsController } from './event-locations.controller';
import { EventLocationsService } from './event-locations.service';

describe('EventLocationsController', () => {
    let controller: EventLocationsController;
    let service: EventLocationsService;

    const mockEventLocations: EventLocations = {
        id: 1,
        eventId: 1,
        countryId: 1,
        stateId: 1,
        cityId: 1,
        locationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByEventId: jest.fn(),
        findByCountryId: jest.fn(),
        findByStateId: jest.fn(),
        findByCityId: jest.fn(),
        findByLocationId: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        softDelete: jest.fn(),
        restore: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventLocationsController],
            providers: [
                {
                    provide: EventLocationsService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<EventLocationsController>(EventLocationsController);
        service = module.get<EventLocationsService>(EventLocationsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event locations record', async () => {
            const createDto: CreateEventLocationsDto = {
                eventId: 1,
                countryId: 1,
                stateId: 1,
                cityId: 1,
                locationId: 1,
            };

            mockService.create.mockResolvedValue(mockEventLocations);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockEventLocations);
        });
    });

    describe('findAll', () => {
        it('should return paginated list of event locations', async () => {
            const mockResponse = {
                data: [mockEventLocations],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockService.findAll.mockResolvedValue(mockResponse);

            const result = await controller.findAll(1, 10);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });

        it('should filter by eventId when provided', async () => {
            const mockResponse = {
                data: [mockEventLocations],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockService.findAll.mockResolvedValue(mockResponse);

            const result = await controller.findAll(1, 10, 1);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, 1, undefined, undefined, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });

        it('should filter by countryId when provided', async () => {
            const mockResponse = {
                data: [mockEventLocations],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockService.findAll.mockResolvedValue(mockResponse);

            const result = await controller.findAll(1, 10, undefined, 1);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, 1, undefined, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('findByEventId', () => {
        it('should return event locations by event id', async () => {
            const eventLocations = [mockEventLocations];

            mockService.findByEventId.mockResolvedValue(eventLocations);

            const result = await controller.findByEventId(1);

            expect(service.findByEventId).toHaveBeenCalledWith(1);
            expect(result).toEqual(eventLocations);
        });
    });

    describe('findByCountryId', () => {
        it('should return event locations by country id', async () => {
            const eventLocations = [mockEventLocations];

            mockService.findByCountryId.mockResolvedValue(eventLocations);

            const result = await controller.findByCountryId(1);

            expect(service.findByCountryId).toHaveBeenCalledWith(1);
            expect(result).toEqual(eventLocations);
        });
    });

    describe('findByStateId', () => {
        it('should return event locations by state id', async () => {
            const eventLocations = [mockEventLocations];

            mockService.findByStateId.mockResolvedValue(eventLocations);

            const result = await controller.findByStateId(1);

            expect(service.findByStateId).toHaveBeenCalledWith(1);
            expect(result).toEqual(eventLocations);
        });
    });

    describe('findByCityId', () => {
        it('should return event locations by city id', async () => {
            const eventLocations = [mockEventLocations];

            mockService.findByCityId.mockResolvedValue(eventLocations);

            const result = await controller.findByCityId(1);

            expect(service.findByCityId).toHaveBeenCalledWith(1);
            expect(result).toEqual(eventLocations);
        });
    });

    describe('findByLocationId', () => {
        it('should return event locations by location id', async () => {
            const eventLocations = [mockEventLocations];

            mockService.findByLocationId.mockResolvedValue(eventLocations);

            const result = await controller.findByLocationId(1);

            expect(service.findByLocationId).toHaveBeenCalledWith(1);
            expect(result).toEqual(eventLocations);
        });
    });

    describe('findOne', () => {
        it('should return event locations by id', async () => {
            mockService.findOne.mockResolvedValue(mockEventLocations);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockEventLocations);
        });
    });

    describe('update', () => {
        it('should update event locations', async () => {
            const updateDto: UpdateEventLocationsDto = {
                countryId: 2,
                stateId: 2,
            };

            const updatedEventLocations = {
                ...mockEventLocations,
                ...updateDto,
            };

            mockService.update.mockResolvedValue(updatedEventLocations);

            const result = await controller.update(1, updateDto);

            expect(service.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual(updatedEventLocations);
        });
    });

    describe('remove', () => {
        it('should remove event locations', async () => {
            mockService.remove.mockResolvedValue(undefined);

            const result = await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
            expect(result).toBeUndefined();
        });
    });

    describe('softDelete', () => {
        it('should soft delete event locations', async () => {
            mockService.softDelete.mockResolvedValue(undefined);

            const result = await controller.softDelete(1);

            expect(service.softDelete).toHaveBeenCalledWith(1);
            expect(result).toBeUndefined();
        });
    });

    describe('restore', () => {
        it('should restore event locations', async () => {
            mockService.restore.mockResolvedValue(undefined);

            const result = await controller.restore(1);

            expect(service.restore).toHaveBeenCalledWith(1);
            expect(result).toBeUndefined();
        });
    });
}); 