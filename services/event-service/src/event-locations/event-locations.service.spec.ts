import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventLocationsDto } from './dto/create-event-locations.dto';
import { UpdateEventLocationsDto } from './dto/update-event-locations.dto';
import { EventLocations } from './entities/event-locations.entity';
import { EventLocationsService } from './event-locations.service';

describe('EventLocationsService', () => {
    let service: EventLocationsService;
    let repository: Repository<EventLocations>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
        softDelete: jest.fn(),
        restore: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventLocationsService,
                {
                    provide: getRepositoryToken(EventLocations),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventLocationsService>(EventLocationsService);
        repository = module.get<Repository<EventLocations>>(getRepositoryToken(EventLocations));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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

            const mockEventLocations = {
                id: 1,
                ...createDto,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockRepository.create.mockReturnValue(mockEventLocations);
            mockRepository.save.mockResolvedValue(mockEventLocations);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockEventLocations);
            expect(result).toEqual(mockEventLocations);
        });
    });

    describe('findAll', () => {
        it('should return paginated list of event locations', async () => {
            const mockData = [
                {
                    id: 1,
                    eventId: 1,
                    countryId: 1,
                    stateId: 1,
                    cityId: 1,
                    locationId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            const mockQueryBuilder = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([mockData, 1]),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findAll(1, 10);

            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('eventLocations');
            expect(result).toEqual({
                data: mockData,
                total: 1,
                page: 1,
                limit: 10,
            });
        });

        it('should filter by eventId when provided', async () => {
            const mockQueryBuilder = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(1, 10, 1);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                'eventLocations.eventId = :eventId',
                { eventId: 1 },
            );
        });

        it('should filter by countryId when provided', async () => {
            const mockQueryBuilder = {
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(1, 10, undefined, 1);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                'eventLocations.countryId = :countryId',
                { countryId: 1 },
            );
        });
    });

    describe('findOne', () => {
        it('should return event locations by id', async () => {
            const mockEventLocations = {
                id: 1,
                eventId: 1,
                countryId: 1,
                stateId: 1,
                cityId: 1,
                locationId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockRepository.findOne.mockResolvedValue(mockEventLocations);

            const result = await service.findOne(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(result).toEqual(mockEventLocations);
        });

        it('should throw NotFoundException if event locations not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(
                new NotFoundException('Event locations with ID 999 not found'),
            );
        });
    });

    describe('findByEventId', () => {
        it('should return event locations by event id', async () => {
            const mockData = [
                {
                    id: 1,
                    eventId: 1,
                    countryId: 1,
                    stateId: 1,
                    cityId: 1,
                    locationId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findByEventId(1);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { eventId: 1 },
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('findByCountryId', () => {
        it('should return event locations by country id', async () => {
            const mockData = [
                {
                    id: 1,
                    eventId: 1,
                    countryId: 1,
                    stateId: 1,
                    cityId: 1,
                    locationId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findByCountryId(1);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { countryId: 1 },
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('findByStateId', () => {
        it('should return event locations by state id', async () => {
            const mockData = [
                {
                    id: 1,
                    eventId: 1,
                    countryId: 1,
                    stateId: 1,
                    cityId: 1,
                    locationId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findByStateId(1);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { stateId: 1 },
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('findByCityId', () => {
        it('should return event locations by city id', async () => {
            const mockData = [
                {
                    id: 1,
                    eventId: 1,
                    countryId: 1,
                    stateId: 1,
                    cityId: 1,
                    locationId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findByCityId(1);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { cityId: 1 },
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('findByLocationId', () => {
        it('should return event locations by location id', async () => {
            const mockData = [
                {
                    id: 1,
                    eventId: 1,
                    countryId: 1,
                    stateId: 1,
                    cityId: 1,
                    locationId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findByLocationId(1);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { locationId: 1 },
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('update', () => {
        it('should update event locations', async () => {
            const updateDto: UpdateEventLocationsDto = {
                countryId: 2,
                stateId: 2,
            };

            const existingEventLocations = {
                id: 1,
                eventId: 1,
                countryId: 1,
                stateId: 1,
                cityId: 1,
                locationId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            const updatedEventLocations = {
                ...existingEventLocations,
                ...updateDto,
            };

            mockRepository.findOne.mockResolvedValue(existingEventLocations);
            mockRepository.save.mockResolvedValue(updatedEventLocations);

            const result = await service.update(1, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(updatedEventLocations);
            expect(result).toEqual(updatedEventLocations);
        });
    });

    describe('remove', () => {
        it('should remove event locations', async () => {
            const mockEventLocations = {
                id: 1,
                eventId: 1,
                countryId: 1,
                stateId: 1,
                cityId: 1,
                locationId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockRepository.findOne.mockResolvedValue(mockEventLocations);
            mockRepository.remove.mockResolvedValue(mockEventLocations);

            await service.remove(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockEventLocations);
        });
    });

    describe('softDelete', () => {
        it('should soft delete event locations', async () => {
            const mockEventLocations = {
                id: 1,
                eventId: 1,
                countryId: 1,
                stateId: 1,
                cityId: 1,
                locationId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            mockRepository.findOne.mockResolvedValue(mockEventLocations);
            mockRepository.softDelete.mockResolvedValue(undefined);

            await service.softDelete(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });
    });

    describe('restore', () => {
        it('should restore soft deleted event locations', async () => {
            mockRepository.restore.mockResolvedValue(undefined);

            await service.restore(1);

            expect(mockRepository.restore).toHaveBeenCalledWith(1);
        });
    });
}); 