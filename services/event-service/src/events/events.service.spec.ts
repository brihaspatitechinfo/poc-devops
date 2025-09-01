import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;

  const mockEventRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated events with active filter', async () => {
      const mockEvents = [mockEvent];
      const mockTotal = 1;
      mockEventRepository.findAndCount.mockResolvedValue([mockEvents, mockTotal]);

      const result = await service.findAll(true, 1, 10);

      expect(mockEventRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { isActive: true },
        order: { startDate: 'ASC' },
      });
      expect(result).toEqual({
        events: mockEvents,
        pagination: {
          page: 1,
          limit: 10,
          total: mockTotal,
          totalPages: 1,
        },
      });
    });

    it('should return paginated events without active filter', async () => {
      const mockEvents = [mockEvent];
      const mockTotal = 1;
      mockEventRepository.findAndCount.mockResolvedValue([mockEvents, mockTotal]);

      const result = await service.findAll(false, 2, 5);

      expect(mockEventRepository.findAndCount).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        where: {},
        order: { startDate: 'ASC' },
      });
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(5);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockEventRepository.findAndCount.mockRejectedValue(error);

      await expect(service.findAll(true, 1, 10)).rejects.toThrow(
        new BadRequestException('Failed to fetch events: Database connection failed'),
      );
    });
  });

  describe('findOne', () => {
    it('should return an event by ID', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockEvent);

      const result = await service.findOne(1);

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { eventId: 1 },
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockEventRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toThrow(
        new BadRequestException('Failed to fetch event: Database error'),
      );
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createdEvent = { ...mockEvent, eventId: '2' };
      mockEventRepository.create.mockReturnValue(createdEvent);
      mockEventRepository.save.mockResolvedValue(createdEvent);

      const result = await service.create(mockCreateEventDto);

      expect(mockEventRepository.create).toHaveBeenCalledWith(mockCreateEventDto);
      expect(mockEventRepository.save).toHaveBeenCalledWith(createdEvent);
      expect(result).toEqual(createdEvent);
    });

    it('should handle database errors during creation', async () => {
      const error = new Error('Validation failed');
      mockEventRepository.create.mockReturnValue(mockEvent);
      mockEventRepository.save.mockRejectedValue(error);

      await expect(service.create(mockCreateEventDto)).rejects.toThrow(
        new BadRequestException('Failed to create event: Validation failed'),
      );
    });
  });

  describe('update', () => {
    it('should update an existing event', async () => {
      const updateResult = { affected: 1 };
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(1, mockUpdateEventDto);

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { eventId: 1 },
      });
      expect(mockEventRepository.update).toHaveBeenCalledWith(1, mockUpdateEventDto);
      expect(result).toEqual(updateResult);
    });

    it('should throw NotFoundException when updating non-existent event', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateEventDto)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );
    });

    it('should handle database errors during update', async () => {
      const error = new Error('Update failed');
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.update.mockRejectedValue(error);

      await expect(service.update(1, mockUpdateEventDto)).rejects.toThrow(
        new BadRequestException('Failed to update event: Update failed'),
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing event', async () => {
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.remove.mockResolvedValue(mockEvent);

      const result = await service.remove(1);

      expect(mockEventRepository.findOne).toHaveBeenCalledWith({
        where: { eventId: 1 },
      });
      expect(mockEventRepository.remove).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual({ message: 'Event deleted successfully' });
    });

    it('should throw NotFoundException when removing non-existent event', async () => {
      mockEventRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Event not found'),
      );
    });

    it('should handle database errors during removal', async () => {
      const error = new Error('Delete failed');
      mockEventRepository.findOne.mockResolvedValue(mockEvent);
      mockEventRepository.remove.mockRejectedValue(error);

      await expect(service.remove(1)).rejects.toThrow(
        new BadRequestException('Failed to delete event: Delete failed'),
      );
    });
  });
});
