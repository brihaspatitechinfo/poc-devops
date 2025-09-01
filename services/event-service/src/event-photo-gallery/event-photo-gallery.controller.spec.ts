import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventPhotoGalleryDto } from './dto/create-event-photo-gallery.dto';
import { UpdateEventPhotoGalleryDto } from './dto/update-event-photo-gallery.dto';
import { EventPhotoGallery } from './entities/event-photo-gallery.entity';
import { EventPhotoGalleryController } from './event-photo-gallery.controller';
import { EventPhotoGalleryService } from './event-photo-gallery.service';

describe('EventPhotoGalleryController', () => {
    let controller: EventPhotoGalleryController;
    let service: EventPhotoGalleryService;

    const mockPhoto: EventPhotoGallery = {
        id: 1,
        eventId: 1,
        imagePath: '/uploads/events/photo1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        // deletedAt: undefined,
    };

    const mockService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByEventId: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        hardRemove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventPhotoGalleryController],
            providers: [
                {
                    provide: EventPhotoGalleryService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<EventPhotoGalleryController>(EventPhotoGalleryController);
        service = module.get<EventPhotoGalleryService>(EventPhotoGalleryService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return paginated photos', async () => {
            const mockResult = {
                photos: [mockPhoto],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            mockService.findAll.mockResolvedValue(mockResult);

            const result = await controller.findAll(1, 10);

            expect(result).toEqual(mockResult);
            expect(service.findAll).toHaveBeenCalledWith(1, 10);
        });

        it('should use default pagination values', async () => {
            const mockResult = {
                photos: [mockPhoto],
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
            expect(service.findAll).toHaveBeenCalledWith(1, 10);
        });
    });

    describe('findOne', () => {
        it('should return a photo by id', async () => {
            mockService.findOne.mockResolvedValue(mockPhoto);

            const result = await controller.findOne(1);

            expect(result).toEqual(mockPhoto);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('findByEventId', () => {
        it('should return photos by event id', async () => {
            const mockResult = {
                photos: [mockPhoto],
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

    describe('create', () => {
        it('should create a new photo', async () => {
            const createDto: CreateEventPhotoGalleryDto = {
                eventId: 1,
                imagePath: '/uploads/events/photo1.jpg',
            };

            mockService.create.mockResolvedValue(mockPhoto);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockPhoto);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('update', () => {
        it('should update an existing photo', async () => {
            const updateDto: UpdateEventPhotoGalleryDto = {
                eventId: 2,
                imagePath: '/uploads/events/updated-photo.jpg',
            };

            const updatedPhoto = { ...mockPhoto, ...updateDto };

            mockService.update.mockResolvedValue(updatedPhoto);

            const result = await controller.update(1, updateDto);

            expect(result).toEqual(updatedPhoto);
            expect(service.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('should soft delete a photo', async () => {
            const mockResult = { message: 'Event photo deleted successfully' };

            mockService.remove.mockResolvedValue(mockResult);

            const result = await controller.remove(1);

            expect(result).toEqual(mockResult);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });

    describe('hardRemove', () => {
        it('should permanently delete a photo', async () => {
            const mockResult = { message: 'Event photo permanently deleted successfully' };

            mockService.hardRemove.mockResolvedValue(mockResult);

            const result = await controller.hardRemove(1);

            expect(result).toEqual(mockResult);
            expect(service.hardRemove).toHaveBeenCalledWith(1);
        });
    });
}); 