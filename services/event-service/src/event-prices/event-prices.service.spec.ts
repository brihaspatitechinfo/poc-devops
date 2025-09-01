import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventPriceDto } from './dto/create-event-price.dto';
import { UpdateEventPriceDto } from './dto/update-event-price.dto';
import { EventPrice } from './entities/event-price.entity';
import { EventPricesService } from './event-prices.service';

describe('EventPricesService', () => {
    let service: EventPricesService;
    let repository: Repository<EventPrice>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventPricesService,
                {
                    provide: getRepositoryToken(EventPrice),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventPricesService>(EventPricesService);
        repository = module.get<Repository<EventPrice>>(getRepositoryToken(EventPrice));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event price', async () => {
            const createDto: CreateEventPriceDto = {
                eventId: 1,
                currencyId: 1,
                price: 99.99,
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event prices', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 1, currencyId: 2, price: 89.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event prices for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByEventId(eventId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { eventId: eventId }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByCurrencyId', () => {
        it('should return event prices for a specific currency', async () => {
            const currencyId = 1;
            const expectedResult = [
                { id: 1, eventId: 1, currencyId: currencyId, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByCurrencyId(currencyId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { currencyId: currencyId }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event price', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findOne(id);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when event price not found', async () => {
            const id = 999;

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an event price', async () => {
            const id = 1;
            const updateDto: UpdateEventPriceDto = { price: 149.99 };
            const existingPrice = { id, eventId: 1, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() };
            const expectedResult = { ...existingPrice, ...updateDto };

            mockRepository.findOne.mockResolvedValue(existingPrice);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.update(id, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event price', async () => {
            const id = 1;
            const existingPrice = { id, eventId: 1, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(existingPrice);
            mockRepository.remove.mockResolvedValue(existingPrice);

            await service.remove(id);

            expect(mockRepository.remove).toHaveBeenCalledWith(existingPrice);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event prices', async () => {
            const prices: CreateEventPriceDto[] = [
                { eventId: 1, currencyId: 1, price: 99.99 },
                { eventId: 1, currencyId: 2, price: 89.99 },
            ];

            const expectedResult = [
                { id: 1, ...prices[0], createdAt: new Date(), updatedAt: new Date() },
                { id: 2, ...prices[1], createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.bulkCreate(prices);

            expect(mockRepository.create).toHaveBeenCalledWith(prices);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('removeByEventId', () => {
        it('should remove all prices for an event', async () => {
            const eventId = 1;

            mockRepository.delete.mockResolvedValue({ affected: 2 });

            await service.removeByEventId(eventId);

            expect(mockRepository.delete).toHaveBeenCalledWith({ eventId: eventId });
        });
    });

    describe('removeByCurrencyId', () => {
        it('should remove all prices for a currency', async () => {
            const currencyId = 1;

            mockRepository.delete.mockResolvedValue({ affected: 3 });

            await service.removeByCurrencyId(currencyId);

            expect(mockRepository.delete).toHaveBeenCalledWith({ currencyId: currencyId });
        });
    });

    describe('findEventIdsByCurrencyId', () => {
        it('should return event IDs for a specific currency', async () => {
            const currencyId = 1;
            const prices = [
                { id: 1, eventId: 1, currencyId: currencyId, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 2, currencyId: currencyId, price: 89.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(prices);

            const result = await service.findEventIdsByCurrencyId(currencyId);

            expect(result).toEqual([1, 2]);
        });
    });

    describe('findCurrencyIdsByEventId', () => {
        it('should return currency IDs for a specific event', async () => {
            const eventId = 1;
            const prices = [
                { id: 1, eventId: eventId, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: eventId, currencyId: 2, price: 89.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(prices);

            const result = await service.findCurrencyIdsByEventId(eventId);

            expect(result).toEqual([1, 2]);
        });
    });

    describe('findPriceByEventAndCurrency', () => {
        it('should return price for a specific event and currency', async () => {
            const eventId = 1;
            const currencyId = 1;
            const expectedResult = { id: 1, eventId: eventId, currencyId: currencyId, price: 99.99, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findPriceByEventAndCurrency(eventId, currencyId);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: {
                    eventId: eventId,
                    currencyId: currencyId
                }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should return null when price not found', async () => {
            const eventId = 1;
            const currencyId = 1;

            mockRepository.findOne.mockResolvedValue(null);

            const result = await service.findPriceByEventAndCurrency(eventId, currencyId);

            expect(result).toBeNull();
        });
    });
}); 