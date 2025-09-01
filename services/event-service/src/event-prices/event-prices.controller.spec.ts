import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventPriceDto } from './dto/create-event-price.dto';
import { UpdateEventPriceDto } from './dto/update-event-price.dto';
import { EventPricesController } from './event-prices.controller';
import { EventPricesService } from './event-prices.service';

describe('EventPricesController', () => {
    let controller: EventPricesController;
    let service: EventPricesService;

    const mockEventPricesService = {
        create: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn(),
        findByEventId: jest.fn(),
        findByCurrencyId: jest.fn(),
        findCurrencyIdsByEventId: jest.fn(),
        findEventIdsByCurrencyId: jest.fn(),
        findPriceByEventAndCurrency: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeByEventId: jest.fn(),
        removeByCurrencyId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventPricesController],
            providers: [
                {
                    provide: EventPricesService,
                    useValue: mockEventPricesService,
                },
            ],
        }).compile();

        controller = module.get<EventPricesController>(EventPricesController);
        service = module.get<EventPricesService>(EventPricesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event price', async () => {
            const createDto: CreateEventPriceDto = {
                eventId: 1,
                currencyId: 1,
                price: 99.99,
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockEventPricesService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResult);
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

            mockEventPricesService.bulkCreate.mockResolvedValue(expectedResult);

            const result = await controller.bulkCreate(prices);

            expect(service.bulkCreate).toHaveBeenCalledWith(prices);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event prices', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 1, currencyId: 2, price: 89.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventPricesService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event prices for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventPricesService.findByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByCurrencyId', () => {
        it('should return event prices for a specific currency', async () => {
            const currencyId = 1;
            const expectedResult = [
                { id: 1, eventId: 1, currencyId: currencyId, price: 99.99, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventPricesService.findByCurrencyId.mockResolvedValue(expectedResult);

            const result = await controller.findByCurrencyId(currencyId);

            expect(service.findByCurrencyId).toHaveBeenCalledWith(currencyId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findCurrencyIdsByEventId', () => {
        it('should return currency IDs for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [1, 2];

            mockEventPricesService.findCurrencyIdsByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findCurrencyIdsByEventId(eventId);

            expect(service.findCurrencyIdsByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findEventIdsByCurrencyId', () => {
        it('should return event IDs for a specific currency', async () => {
            const currencyId = 1;
            const expectedResult = [1, 2];

            mockEventPricesService.findEventIdsByCurrencyId.mockResolvedValue(expectedResult);

            const result = await controller.findEventIdsByCurrencyId(currencyId);

            expect(service.findEventIdsByCurrencyId).toHaveBeenCalledWith(currencyId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findPriceByEventAndCurrency', () => {
        it('should return price for a specific event and currency', async () => {
            const eventId = 1;
            const currencyId = 1;
            const expectedResult = { id: 1, eventId: eventId, currencyId: currencyId, price: 99.99, createdAt: new Date(), updatedAt: new Date() };

            mockEventPricesService.findPriceByEventAndCurrency.mockResolvedValue(expectedResult);

            const result = await controller.findPriceByEventAndCurrency(eventId, currencyId);

            expect(service.findPriceByEventAndCurrency).toHaveBeenCalledWith(eventId, currencyId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event price', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, currencyId: 1, price: 99.99, createdAt: new Date(), updatedAt: new Date() };

            mockEventPricesService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update an event price', async () => {
            const id = 1;
            const updateDto: UpdateEventPriceDto = { price: 149.99 };
            const expectedResult = { id, eventId: 1, currencyId: 1, price: 149.99, createdAt: new Date(), updatedAt: new Date() };

            mockEventPricesService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event price', async () => {
            const id = 1;

            mockEventPricesService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('removeByEventId', () => {
        it('should remove all prices for an event', async () => {
            const eventId = 1;

            mockEventPricesService.removeByEventId.mockResolvedValue(undefined);

            await controller.removeByEventId(eventId);

            expect(service.removeByEventId).toHaveBeenCalledWith(eventId);
        });
    });

    describe('removeByCurrencyId', () => {
        it('should remove all prices for a currency', async () => {
            const currencyId = 1;

            mockEventPricesService.removeByCurrencyId.mockResolvedValue(undefined);

            await controller.removeByCurrencyId(currencyId);

            expect(service.removeByCurrencyId).toHaveBeenCalledWith(currencyId);
        });
    });
}); 