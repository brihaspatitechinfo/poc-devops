import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventsCategoryDto } from './dto/create-events-category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events-category.dto';
import { EventsCategory } from './entities/events-category.entity';
import { EventsCategoryController } from './events-category.controller';
import { EventsCategoryService } from './events-category.service';

describe('EventsCategoryController', () => {
    let controller: EventsCategoryController;
    let service: EventsCategoryService;

    const mockEventsCategory: EventsCategory = {
        id: 1,
        eventId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const mockService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByEventId: jest.fn(),
        findByCategoryId: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsCategoryController],
            providers: [
                {
                    provide: EventsCategoryService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<EventsCategoryController>(EventsCategoryController);
        service = module.get<EventsCategoryService>(EventsCategoryService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated events categories', async () => {
            const mockResult = {
                eventsCategories: [mockEventsCategory],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            mockService.findAll.mockResolvedValue(mockResult);

                  const result = await controller.findAll(true, 1, 10);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(true, 1, 10);
        });

        it('should use default pagination values', async () => {
            const mockResult = {
                eventsCategories: [mockEventsCategory],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            mockService.findAll.mockResolvedValue(mockResult);

                  const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(true, 1, 10);
        });
    });

    describe('findOne', () => {
        it('should return an events category by id', async () => {
            mockService.findOne.mockResolvedValue(mockEventsCategory);

            const result = await controller.findOne(1);

            expect(result).toEqual(mockEventsCategory);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('findByEventId', () => {
        it('should return events categories by event id', async () => {
            const mockResult = {
                eventsCategories: [mockEventsCategory],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            mockService.findByEventId.mockResolvedValue(mockResult);

            const result = await controller.findByEventId(1, 1, 10);

            expect(result).toEqual(mockResult);
            expect(service.findByEventId).toHaveBeenCalledWith(1, 1, 10);
        });
    });

    describe('findByCategoryId', () => {
        it('should return events categories by category id', async () => {
            const mockResult = {
                eventsCategories: [mockEventsCategory],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            mockService.findByCategoryId.mockResolvedValue(mockResult);

            const result = await controller.findByCategoryId(1, 1, 10);

            expect(result).toEqual(mockResult);
            expect(service.findByCategoryId).toHaveBeenCalledWith(1, 1, 10);
        });
    });

    describe('create', () => {
        it('should create a new events category', async () => {
            const createDto: CreateEventsCategoryDto = {
                eventId: 1,
                categoryId: 1,
            };

            mockService.create.mockResolvedValue(mockEventsCategory);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockEventsCategory);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('update', () => {
        it('should update an existing events category', async () => {
            const updateDto: UpdateEventsCategoryDto = {
                eventId: 2,
                categoryId: 2,
            };

            const updatedEventsCategory = { ...mockEventsCategory, ...updateDto };

            mockService.update.mockResolvedValue(updatedEventsCategory);

            const result = await controller.update(1, updateDto);

            expect(result).toEqual(updatedEventsCategory);
            expect(service.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('should soft delete an events category', async () => {
            const mockResult = { message: 'Events category deleted successfully' };

            mockService.remove.mockResolvedValue(mockResult);

            const result = await controller.remove(1);

            expect(result).toEqual(mockResult);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
}); 