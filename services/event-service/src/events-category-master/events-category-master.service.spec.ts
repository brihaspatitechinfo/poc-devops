import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventsCategoryMasterDto } from './dto/create-events-category-master.dto';
import { UpdateEventsCategoryMasterDto } from './dto/update-events-category-master.dto';
import { EventsCategoryMaster } from './entities/events-category-master.entity';
import { EventsCategoryMasterService } from './events-category-master.service';

describe('EventsCategoryMasterService', () => {
    let service: EventsCategoryMasterService;
    let repository: Repository<EventsCategoryMaster>;

    const mockRepository = {
        findAndCount: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockCategory: EventsCategoryMaster = {
        id: 1,
        name: 'Technology',
        sortOrder: 1,
        isActive: true,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsCategoryMasterService,
                {
                    provide: getRepositoryToken(EventsCategoryMaster),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventsCategoryMasterService>(EventsCategoryMasterService);
        repository = module.get<Repository<EventsCategoryMaster>>(getRepositoryToken(EventsCategoryMaster));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated categories', async () => {
            const mockCategories = [mockCategory];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockCategories, mockTotal]);

            const result = await service.findAll(true, 1, 10);

            expect(result).toEqual({
                categories: mockCategories,
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
        where: { isActive: true },
        order: { sortOrder: 'ASC' },
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
        it('should return a category by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockCategory);

            const result = await service.findOne(1);

            expect(result).toEqual(mockCategory);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException when category not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findOne.mockRejectedValue(error);

            await expect(service.findOne(1)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const createDto: CreateEventsCategoryMasterDto = {
                name: 'Technology',
                sortOrder: 1,
            };

            mockRepository.create.mockReturnValue(mockCategory);
            mockRepository.save.mockResolvedValue(mockCategory);

            const result = await service.create(createDto);

            expect(result).toEqual(mockCategory);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockCategory);
        });

        it('should handle errors and throw BadRequestException', async () => {
            const createDto: CreateEventsCategoryMasterDto = {
                name: 'Technology',
                sortOrder: 1,
            };

            const error = new Error('Database error');
            mockRepository.create.mockReturnValue(mockCategory);
            mockRepository.save.mockRejectedValue(error);

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockCategory);
        });
    });

    describe('update', () => {
        it('should update an existing category', async () => {
            const updateDto: UpdateEventsCategoryMasterDto = {
                name: 'Updated Technology',
                sortOrder: 2,
            };

            const updatedCategory = { ...mockCategory, ...updateDto };

            mockRepository.findOne.mockResolvedValue(mockCategory);
            mockRepository.update.mockResolvedValue({ affected: 1 });
            mockRepository.findOne.mockResolvedValueOnce(mockCategory).mockResolvedValueOnce(updatedCategory);

            const result = await service.update(1, updateDto);

            expect(result).toEqual(updatedCategory);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw NotFoundException when category not found', async () => {
            const updateDto: UpdateEventsCategoryMasterDto = {
                name: 'Updated Technology',
            };

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const updateDto: UpdateEventsCategoryMasterDto = {
                name: 'Updated Technology',
            };

            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockCategory);
            mockRepository.update.mockRejectedValue(error);

            await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('should remove a category', async () => {
            mockRepository.findOne.mockResolvedValue(mockCategory);
            mockRepository.remove.mockResolvedValue(mockCategory);

            const result = await service.remove(1);

            expect(result).toEqual({ message: 'Event category deleted successfully' });
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockCategory);
        });

        it('should throw NotFoundException when category not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockCategory);
            mockRepository.remove.mockRejectedValue(error);

            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockCategory);
        });
    });
}); 