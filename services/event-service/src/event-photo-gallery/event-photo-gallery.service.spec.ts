import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventPhotoGalleryDto } from './dto/create-event-photo-gallery.dto';
import { UpdateEventPhotoGalleryDto } from './dto/update-event-photo-gallery.dto';
import { EventPhotoGallery } from './entities/event-photo-gallery.entity';
import { EventPhotoGalleryService } from './event-photo-gallery.service';

describe('EventPhotoGalleryService', () => {
    let service: EventPhotoGalleryService;
    let repository: Repository<EventPhotoGallery>;

    const mockRepository = {
        findAndCount: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
        remove: jest.fn(),
    };

    const mockPhoto: EventPhotoGallery = {
        id: 1,
        eventId: 1,
        imagePath: '/uploads/events/photo1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventPhotoGalleryService,
                {
                    provide: getRepositoryToken(EventPhotoGallery),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventPhotoGalleryService>(EventPhotoGalleryService);
        repository = module.get<Repository<EventPhotoGallery>>(getRepositoryToken(EventPhotoGallery));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated photos', async () => {
            const mockPhotos = [mockPhoto];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockPhotos, mockTotal]);

            const result = await service.findAll(1, 10);

            expect(result).toEqual({
                photos: mockPhotos,
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
                order: { createdAt: 'DESC' },
                withDeleted: false,
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findAndCount.mockRejectedValue(error);

            await expect(service.findAll()).rejects.toThrow(BadRequestException);
            expect(mockRepository.findAndCount).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a photo by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockPhoto);

            const result = await service.findOne(1);

            expect(result).toEqual(mockPhoto);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
        });

        it('should throw NotFoundException when photo not found', async () => {
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
        it('should return photos by event id', async () => {
            const mockPhotos = [mockPhoto];
            const mockTotal = 1;
            mockRepository.findAndCount.mockResolvedValue([mockPhotos, mockTotal]);

            const result = await service.findByEventId(1, 1, 10);

            expect(result).toEqual({
                photos: mockPhotos,
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
                order: { createdAt: 'DESC' },
                withDeleted: false,
            });
        });
    });

    describe('create', () => {
        it('should create a new photo', async () => {
            const createDto: CreateEventPhotoGalleryDto = {
                eventId: 1,
                imagePath: '/uploads/events/photo1.jpg',
            };

            mockRepository.create.mockReturnValue(mockPhoto);
            mockRepository.save.mockResolvedValue(mockPhoto);

            const result = await service.create(createDto);

            expect(result).toEqual(mockPhoto);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockPhoto);
        });

        it('should handle errors and throw BadRequestException', async () => {
            const createDto: CreateEventPhotoGalleryDto = {
                eventId: 1,
                imagePath: '/uploads/events/photo1.jpg',
            };

            const error = new Error('Database error');
            mockRepository.create.mockReturnValue(mockPhoto);
            mockRepository.save.mockRejectedValue(error);

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockPhoto);
        });
    });

    describe('update', () => {
        it('should update an existing photo', async () => {
            const updateDto: UpdateEventPhotoGalleryDto = {
                eventId: 2,
                imagePath: '/uploads/events/updated-photo.jpg',
            };

            const updatedPhoto = { ...mockPhoto, ...updateDto };

            mockRepository.findOne.mockResolvedValue(mockPhoto);
            mockRepository.update.mockResolvedValue({ affected: 1 });
            mockRepository.findOne.mockResolvedValueOnce(mockPhoto).mockResolvedValueOnce(updatedPhoto);

            const result = await service.update(1, updateDto);

            expect(result).toEqual(updatedPhoto);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw NotFoundException when photo not found', async () => {
            const updateDto: UpdateEventPhotoGalleryDto = {
                imagePath: '/uploads/events/updated-photo.jpg',
            };

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                withDeleted: false
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const updateDto: UpdateEventPhotoGalleryDto = {
                imagePath: '/uploads/events/updated-photo.jpg',
            };

            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockPhoto);
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
        it('should soft delete a photo', async () => {
            mockRepository.findOne.mockResolvedValue(mockPhoto);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            const result = await service.remove(1);

            expect(result).toEqual({ message: 'Event photo deleted successfully' });
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when photo not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                withDeleted: false
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockPhoto);
            mockRepository.softDelete.mockRejectedValue(error);

            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });
    });

    describe('hardRemove', () => {
        it('should permanently delete a photo', async () => {
            mockRepository.findOne.mockResolvedValue(mockPhoto);
            mockRepository.remove.mockResolvedValue(mockPhoto);

            const result = await service.hardRemove(1);

            expect(result).toEqual({ message: 'Event photo permanently deleted successfully' });
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockPhoto);
        });

        it('should throw NotFoundException when photo not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.hardRemove(999)).rejects.toThrow(NotFoundException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                withDeleted: false
            });
        });

        it('should handle errors and throw BadRequestException', async () => {
            const error = new Error('Database error');
            mockRepository.findOne.mockResolvedValue(mockPhoto);
            mockRepository.remove.mockRejectedValue(error);

            await expect(service.hardRemove(1)).rejects.toThrow(BadRequestException);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                withDeleted: false
            });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockPhoto);
        });
    });
}); 