import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventsCategoryMasterDto } from './dto/create-events-category-master.dto';
import { UpdateEventsCategoryMasterDto } from './dto/update-events-category-master.dto';
import { EventsCategoryMaster } from './entities/events-category-master.entity';
import { EventsCategoryMasterController } from './events-category-master.controller';
import { EventsCategoryMasterService } from './events-category-master.service';

describe('EventsCategoryMasterController', () => {
    let controller: EventsCategoryMasterController;
    let service: EventsCategoryMasterService;

    const mockCategory: EventsCategoryMaster = {
        id: 1,
        name: 'Technology',
        sortOrder: 1,
        isActive: true
    };

    const mockService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsCategoryMasterController],
            providers: [
                {
                    provide: EventsCategoryMasterService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<EventsCategoryMasterController>(EventsCategoryMasterController);
        service = module.get<EventsCategoryMasterService>(EventsCategoryMasterService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated categories', async () => {
            const mockResult = {
                categories: [mockCategory],
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
                categories: [mockCategory],
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
        it('should return a category by id', async () => {
            mockService.findOne.mockResolvedValue(mockCategory);

            const result = await controller.findOne(1);

            expect(result).toEqual(mockCategory);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const createDto: CreateEventsCategoryMasterDto = {
                name: 'Technology',
                sortOrder: 1,
            };

            mockService.create.mockResolvedValue(mockCategory);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockCategory);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('update', () => {
        it('should update an existing category', async () => {
            const updateDto: UpdateEventsCategoryMasterDto = {
                name: 'Updated Technology',
                sortOrder: 2,
            };

            const updatedCategory = { ...mockCategory, ...updateDto };

            mockService.update.mockResolvedValue(updatedCategory);

            const result = await controller.update(1, updateDto);

            expect(result).toEqual(updatedCategory);
            expect(service.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('should remove a category', async () => {
            const mockResult = { message: 'Event category deleted successfully' };

            mockService.remove.mockResolvedValue(mockResult);

            const result = await controller.remove(1);

            expect(result).toEqual(mockResult);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
}); 