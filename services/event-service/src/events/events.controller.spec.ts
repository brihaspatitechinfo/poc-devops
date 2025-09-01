import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockEvent: Event = {
    eventId: 1,
    title: 'Test Event',
    shortDescription: 'Test Description',
    type: 0,
    timezoneId: 75,
    startDate: new Date('2024-03-01T09:00:00Z'),
    endDate: new Date('2024-03-01T17:00:00Z'),
    currency: 'INR',
    isRedact: false,
    email: 'test@example.com',
    detailedDescription: 'Detailed test description',
    questionnaireLabel: 'Please answer a few questions',
    isMarquee: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateEventDto: CreateEventDto = {
    title: 'New Event',
    shortDescription: 'New Description',
    type: 1,
    timezoneId: 75,
    startDate: '2024-03-01T09:00:00Z',
    endDate: '2024-03-01T17:00:00Z',
    currency: 'INR',
    isRedact: false,
    email: 'new@example.com',
    detailedDescription: 'New detailed description',
    questionnaireLabel: 'Please answer questions',
  };

  const mockUpdateEventDto: UpdateEventDto = {
    title: 'Updated Event',
    shortDescription: 'Updated Description',
    type: 1,
    timezoneId: 75,
    startDate: '2024-03-01T09:00:00Z',
    endDate: '2024-03-01T17:00:00Z',
    currency: 'INR',
    isRedact: false,
    email: 'updated@example.com',
    detailedDescription: 'Updated detailed description',
    questionnaireLabel: 'Updated questions',
  };

  const mockPaginatedResponse = {
    events: [mockEvent],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated events with default parameters', async () => {
      mockEventsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(undefined, 1, 10);

      expect(service.findAll).toHaveBeenCalledWith(undefined, 1, 10);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated events with active filter', async () => {
      mockEventsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(true, 2, 5);

      expect(service.findAll).toHaveBeenCalledWith(true, 2, 5);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated events with inactive filter', async () => {
      mockEventsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(false, 1, 20);

      expect(service.findAll).toHaveBeenCalledWith(false, 1, 20);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle service errors', async () => {
      const error = new BadRequestException('Failed to fetch events');
      mockEventsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(true, 1, 10)).rejects.toThrow(
        new BadRequestException('Failed to fetch events'),
      );
    });
  });

  describe('findOne', () => {
    it('should return an event by ID', async () => {
      mockEventsService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEvent);
    });

    it('should handle event not found', async () => {
      const error = new NotFoundException('Event not found');
      mockEventsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );  
    });

    it('should handle service errors', async () => {
      const error = new BadRequestException('Database error');
      mockEventsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow(
        new BadRequestException('Database error'),
      );
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createdEvent = { ...mockEvent, eventId: '2' };
      mockEventsService.create.mockResolvedValue(createdEvent);

      const result = await controller.create(mockCreateEventDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateEventDto);
      expect(result).toEqual(createdEvent);
    });

    it('should handle validation errors during creation', async () => {
      const error = new BadRequestException('Validation failed');
      mockEventsService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateEventDto)).rejects.toThrow(
        new BadRequestException('Validation failed'),
      );
    });

    it('should handle database errors during creation', async () => {
      const error = new BadRequestException('Database connection failed');
      mockEventsService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateEventDto)).rejects.toThrow(
        new BadRequestException('Database connection failed'),
      );
    });
  });

  describe('update', () => {
    it('should update an existing event', async () => {
      const updateResult = { affected: 1 };
      mockEventsService.update.mockResolvedValue(updateResult);

      const result = await controller.update(1, mockUpdateEventDto);

      expect(service.update).toHaveBeenCalledWith(1, mockUpdateEventDto);
      expect(result).toEqual(updateResult);
    });

    it('should handle event not found during update', async () => {
      const error = new NotFoundException('Event not found');
      mockEventsService.update.mockRejectedValue(error);

      await expect(controller.update(999, mockUpdateEventDto)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );
    });

    it('should handle validation errors during update', async () => {
      const error = new BadRequestException('Invalid data');
      mockEventsService.update.mockRejectedValue(error);

      await expect(controller.update(1, mockUpdateEventDto)).rejects.toThrow(
        new BadRequestException('Invalid data'),
      );
    });

    it('should handle database errors during update', async () => {
      const error = new BadRequestException('Update failed');
      mockEventsService.update.mockRejectedValue(error);

      await expect(controller.update(1, mockUpdateEventDto)).rejects.toThrow(
        new BadRequestException('Update failed'),
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing event', async () => {
      const deleteResult = { message: 'Event deleted successfully' };
      mockEventsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(deleteResult);
    });

    it('should handle event not found during removal', async () => {
      const error = new NotFoundException('Event not found');
      mockEventsService.remove.mockRejectedValue(error);

      await expect(controller.remove(999)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );
    });

    it('should handle database errors during removal', async () => {
      const error = new BadRequestException('Delete failed');
      mockEventsService.remove.mockRejectedValue(error);

      await expect(controller.remove(1)).rejects.toThrow(
        new BadRequestException('Delete failed'),
      );
    });
  });

  describe('parameter handling', () => {
    it('should handle string eventId parameter', async () => {
      mockEventsService.findOne.mockResolvedValue(mockEvent);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEvent);
    });

    it('should handle boolean active parameter', async () => {
      mockEventsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(true, 1, 10);

      expect(service.findAll).toHaveBeenCalledWith(true, 1, 10);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle numeric page and limit parameters', async () => {
      mockEventsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(false, 3, 25);

      expect(service.findAll).toHaveBeenCalledWith(false, 3, 25);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('DTO handling', () => {
    it('should handle complete CreateEventDto', async () => {
      const completeDto: CreateEventDto = {
        ...mockCreateEventDto,
        metaTitle: 'Meta Title',
        eventGuid: 'guid-123',
        url: 'https://example.com/event',
        metaDescription: 'Meta description',
        contact: '+1234567890',
        isPaid: true,
        isFeatured: false,
        price: [{ currencyId: 1, price: 99.99 }],
        dialCodeId: 1,
        address: '123 Main St',
        listImage: 'https://example.com/image.jpg',
        liveEventUrl: 'https://zoom.us/j/123',
        recordingUrl: 'https://example.com/recording.mp4',
        isMarquee: true,
        marqueeView: 'featured',
        detailUrl: 'https://example.com/details',
        contributionLabel: 'Contribute',
        createdBy: 'user-123',
      };

      const createdEvent = { ...mockEvent, eventId: '3' };
      mockEventsService.create.mockResolvedValue(createdEvent);

      const result = await controller.create(completeDto);

      expect(service.create).toHaveBeenCalledWith(completeDto);
      expect(result).toEqual(createdEvent);
    });

    it('should handle partial UpdateEventDto', async () => {
      const partialDto: UpdateEventDto = {
        title: 'Updated Title Only',
        shortDescription: 'Updated Description',
        type: 1,
        timezoneId: 75,
        startDate: '2024-03-01T09:00:00Z',
        endDate: '2024-03-01T17:00:00Z',
        currency: 'INR',
        isRedact: false,
        email: 'updated@example.com',
        detailedDescription: 'Updated detailed description',
        questionnaireLabel: 'Updated questions',
      };

      const updateResult = { affected: 1 };
      mockEventsService.update.mockResolvedValue(updateResult);

      const result = await controller.update(1, partialDto);

      expect(service.update).toHaveBeenCalledWith(1, partialDto);
      expect(result).toEqual(updateResult);
    });
  });
});
