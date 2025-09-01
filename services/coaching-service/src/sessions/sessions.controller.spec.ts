import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionStatus } from './entities/session.entity';

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: SessionsService;

  const mockSessionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get<SessionsService>(SessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedResult = {
        id: '1',
        ...createSessionDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSessionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createSessionDto);

      expect(service.create).toHaveBeenCalledWith(createSessionDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated sessions', async () => {
      const expectedResult = {
        sessions: [
          {
            id: '1',
            title: 'Session 1',
            coachId: 'coach-123',
            coacheeId: 'coachee-123',
            status: 'scheduled',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockSessionsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single session', async () => {
      const sessionId = '1';
      const expectedResult = {
        id: sessionId,
        title: 'Test Session',
        coachId: 'coach-123',
        clientId: 'client-123',
        status: 'scheduled',
      };

      mockSessionsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(sessionId);

      expect(service.findOne).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const sessionId = '1';
      const updateSessionDto: UpdateSessionDto = {
        title: 'Updated Session',
        status: SessionStatus.COMPLETED,
      };

      const expectedResult = {
        id: sessionId,
        title: 'Updated Session',
        status: 'completed',
        coachId: 'coach-123',
        clientId: 'client-123',
      };

      mockSessionsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(sessionId, updateSessionDto);

      expect(service.update).toHaveBeenCalledWith(sessionId, updateSessionDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      const sessionId = '1';
      const expectedResult = { message: 'Session deleted successfully' };

      mockSessionsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(sessionId);

      expect(service.remove).toHaveBeenCalledWith(sessionId);
      expect(result).toEqual(expectedResult);
    });
  });
});
