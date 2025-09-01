import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventsCategoryDto } from './dto/create-events-category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events-category.dto';
import { EventsCategory } from './entities/events-category.entity';
import { EventsCategoryService } from './events-category.service';

describe('EventsCategoryService', () => {
    let service: EventsCategoryService;
    let repository: Repository<EventsCategory>;

    const mockRepository = {
        findAndCount: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        remove: jest.fn(),
    };

    const mockEventsCategory: EventsCategory = {
        id: 1,
        eventId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsCategoryService,
                {
                    provide: getRepositoryToken(EventsCategory),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventsCategoryService>(EventsCategoryService);
        repository = module.get<Repository<EventsCategory>>(getRepositoryToken(EventsCategory));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated events categories', async () => {
            const mockEventsCategories = [mockEventsCategory];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockEventsCategories, mockTotal]);

            const result = await service.findAll(true, 1, 10);

            expect(result).toEqual({
                eventsCategories: mockEventsCategories,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: mockTotal,
                    totalPages: 1,
                },
            });
            expect(mockRepository.findAndCount).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
                order: { id: 'ASC' },
                withDeleted: false,
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findAndCount.mockRejectedValue(error);

            await expect(service.findAll(true)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findAndCount).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return an events category by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockEventsCategory);

            const result = await service.findOne(1);

            expect(result).toEqual(mockEventsCategory);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
        });

        it('should throw NotFoundException when events category not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                withDeleted: false
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findOne.mockRejectedValue(error);

            await expect(service.findOne(1)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalled();
        });
    });

    describe('findByEventId', () => {
        it('should return events categories by event id', async () => {
            const mockEventsCategories = [mockEventsCategory];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockEventsCategories, mockTotal]);

            const result = await service.findByEventId(1, 1, 10);

            expect(result).toEqual({
                eventsCategories: mockEventsCategories,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: mockTotal,
                    totalPages: 1,
                },
            });
            expect(mockRepository.findAndCount).toHaveBeenCalledWith({
                where: { eventId: 1 },
                skip: 0,
                take: 10,
                order: { id: 'ASC' },
                withDeleted: false,
            });
        });
    });

    describe('findByCategoryId', () => {
        it('should return events categories by category id', async () => {
            const mockEventsCategories = [mockEventsCategory];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockEventsCategories, mockTotal]);

            const result = await service.findByCategoryId(1, 1, 10);

            expect(result).toEqual({
                eventsCategories: mockEventsCategories,
                pagination: {
                    page: 1,
                    limit: 10,
                    total: mockTotal,
                    totalPages: 1,
                },
            });
            expect(mockRepository.findAndCount).toHaveBeenCalledWith({
                where: { categoryId: 1 },
                skip: 0,
                take: 10,
                order: { id: 'ASC' },
                withDeleted: false,
            });
        });
    });

    describe('create', () => {
        it('should create a new events category', async () => {
            const createDto: CreateEventsCategoryDto = {
                eventId: 1,
                categoryId: 1,
            };

            mockRepository.create.mockReturnValue(mockEventsCategory);
            mockRepository.save.mockResolvedValue(mockEventsCategory);

            const result = await service.create(createDto);

            expect(result).toEqual(mockEventsCategory);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockEventsCategory);
        });

        it('should handle errors and throw BadRequestException', async () => {
            const createDto: CreateEventsCategoryDto = {
                eventId: 1,
                categoryId: 1,
            };

            const error = new Error('Database error');
            mockRepository.create.mockReturnValue(mockEventsCategory);
            mockRepository.save.mockRejectedValue(error);

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockEventsCategory);
        });
    });

    describe('update', () => {
        it('should update an existing events category', async () => {
            const updateDto: UpdateEventsCategoryDto = {
                eventId: 2,
                categoryId: 2,
            };

            const updatedEventsCategory = { ...mockEventsCategory, ...updateDto };

            mockRepository.findOne.mockResolvedValue(mockEventsCategory);
            mockRepository.update.mockResolvedValue({ affected: 1 });
            mockRepository.findOne.mockResolvedValueOnce(mockEventsCategory).mockResolvedValueOnce(updatedEventsCategory);

            const result = await service.update(1, updateDto);

            expect(result).toEqual(updatedEventsCategory);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw NotFoundException when events category not found', async () => {
            const updateDto: UpdateEventsCategoryDto = {
                eventId: 2,
            };

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                withDeleted: false
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const updateDto: UpdateEventsCategoryDto = {
                eventId: 2,
            };

            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockEventsCategory);
            mockRepository.update.mockRejectedValue(error);

            await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('should soft delete an events category', async () => {
            mockRepository.findOne.mockResolvedValue(mockEventsCategory);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            const result = await service.remove(1);

            expect(result).toEqual({ message: 'Events category deleted successfully' });
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when events category not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                withDeleted: false
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockEventsCategory);
            mockRepository.softDelete.mockRejectedValue(error);
            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });
    });
}); 