import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { NotFoundException } from '@nestjs/common';

describe('SessionsService', () => {
  let service: SessionsService;
  let repository: Repository<Session>;

  const mockSession = {
    id: '1',
    title: 'Test Session',
    description: 'Test Description',
    coachId: 'coach-123',
    coacheeId: 'coachee-123',
    scheduledAt: new Date('2024-02-01T10:00:00Z'),
    duration: 60,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/test',
    notes: 'Test notes',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    repository = module.get<Repository<Session>>(getRepositoryToken(Session));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto: CreateSessionDto = {
        title: 'Test Session',
        description: 'Test Description',
        coachId: 'coach-123',
        coacheeId: 'coachee-123',
        scheduledAt: '2024-02-01T10:00:00Z',
        duration: 60,
        meetingLink: 'https://meet.google.com/test',
        notes: 'Test notes',
      };

      mockRepository.create.mockReturnValue(mockSession);
      mockRepository.save.mockResolvedValue(mockSession);

      const result = await service.create(createSessionDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createSessionDto,
        scheduledAt: new Date(createSessionDto.scheduledAt),
      });
      expect(repository.save).toHaveBeenCalledWith(mockSession);
      expect(result).toEqual(mockSession);
    });
  });

  describe('findAll', () => {
    it('should return paginated sessions', async () => {
      const sessions = [mockSession];
      const total = 1;

      mockRepository.findAndCount.mockResolvedValue([sessions, total]);

      const result = await service.findAll(1, 10);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { scheduledAt: 'DESC' },
      });
      expect(result).toEqual({
        sessions,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single session', async () => {
      mockRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockSession);
    });

    it('should throw NotFoundException when session not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updateSessionDto: UpdateSessionDto = {
        title: 'Updated Session',
        scheduledAt: '2024-02-02T10:00:00Z',
      };

      const updatedSession = {
        ...mockSession,
        ...updateSessionDto,
        scheduledAt: new Date(updateSessionDto.scheduledAt),
      };

      // Mock findOne to return the session
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSession as any);
      mockRepository.save.mockResolvedValue(updatedSession);

      const result = await service.update('1', updateSessionDto);

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedSession);
    });

    it('should throw NotFoundException when session not found', async () => {
      const updateSessionDto: UpdateSessionDto = {
        title: 'Updated Session',
      };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update('1', updateSessionDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should cancel a session', async () => {
      const cancelledSession = { ...mockSession, status: 'cancelled' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockSession as any);
      mockRepository.save.mockResolvedValue(cancelledSession);

      const result = await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Session cancelled successfully' });
    });

    it('should throw NotFoundException when session not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
