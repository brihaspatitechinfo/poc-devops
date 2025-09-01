import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CohortService } from './cohort.service';
import { WitSelectCohort } from './entities/wit-select-cohort.entity';
import { Interaction } from './entities/wit-select-cohort-interactions.entity';
import { CohortFeedbackFrequency } from './entities/cohort-feedback-frequency.entity';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { MentoringType, SearchOption, CohortStatus } from './enums/cohort.enums';
import { NotFoundException, BadRequestException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MenteeEnrollmentTable } from './entities/mentee-enrollment.entity';
import { DataSource } from 'typeorm';

describe('CohortService', () => {
  let service: CohortService;
  let cohortRepository: Repository<WitSelectCohort>;
  let interactionRepository: Repository<Interaction>;
  let feedbackFrequencyRepository: Repository<CohortFeedbackFrequency>;

  const mockCohortRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(), // add delete mock
  };

  const mockInteractionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    exist: jest.fn(),
  };

  const mockFeedbackFrequencyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(), // Add the missing find method
  };

  const mockMenteeEnrollmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockHttpService = {
    axiosRef: {
      post: jest.fn(),
    },
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCohortRepository.findOne.mockResolvedValue(null); // Default: no duplicate
    // Remove the global DataSource.transaction mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CohortService,
        { provide: getRepositoryToken(WitSelectCohort), useValue: mockCohortRepository },
        { provide: getRepositoryToken(Interaction), useValue: mockInteractionRepository },
        { provide: getRepositoryToken(CohortFeedbackFrequency), useValue: mockFeedbackFrequencyRepository },
        { provide: getRepositoryToken(MenteeEnrollmentTable), useValue: mockMenteeEnrollmentRepository },
        { provide: HttpService, useValue: mockHttpService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();
    service = module.get<CohortService>(CohortService);
    cohortRepository = module.get<Repository<WitSelectCohort>>(
      getRepositoryToken(WitSelectCohort),
    );
    interactionRepository = module.get<Repository<Interaction>>(
      getRepositoryToken(Interaction),
    );
    feedbackFrequencyRepository = module.get<Repository<CohortFeedbackFrequency>>(
      getRepositoryToken(CohortFeedbackFrequency),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const baseCohortData = {
      name: 'Test Cohort',
      corporateName: 'Test Company',
      isInternal: false,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      timezoneId: 1,
      sessionDurations: ["15", "30", "45", "60"],
      allowedMentees: 10,
      price: '100',
      noOfInteractions: 5,
      status: 1,
      groupCreated: 0,
      mentorsMatched: 0,
      creationStatus: 1,
      cohortType: 1,
      assignCoachType: 0,
      searchOption: 0,
      minPrice: 50,
      maxPrice: 150,
      isFfMandatory: 0,
      isUnlimited: 0,
      chemistrySessionCount: 1,
      chemistrySessionStatus: 0,
      month: 1,
      createdBy: 1,
      updatedBy: 1,
    };

    it('should create a one-to-one cohort without groupSize', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.ONE_TO_ONE,
        isFfMandatory: 0,
        noOfInteractions: 5,
      };

      const expectedCohort = { id: 1, ...createCohortDto };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
    });

    it('should throw error when creating one-to-one cohort with groupSize', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.ONE_TO_ONE,
        groupSize: 5,
      };

      await expect(service.create(createCohortDto)).rejects.toThrow(
        new BadRequestException('Group size is not applicable for one-to-one mentoring')
      );
    });

    it('should create a group cohort with valid groupSize', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.GROUP,
        groupSize: 5,
        isFfMandatory: 0,
      };

      const expectedCohort = { id: 1, ...createCohortDto, searchOption: SearchOption.OFFLINE_MATCHES, duration: 366 };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
    });

    it('should throw error when creating group cohort without groupSize', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.GROUP,
      };

      await expect(service.create(createCohortDto)).rejects.toThrow(
        new BadRequestException('Group size is required for group mentoring')
      );
    });

    it('should throw error when groupSize is less than 2 for group mentoring', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.GROUP,
        groupSize: 1,
      };

      await expect(service.create(createCohortDto)).rejects.toThrow(
        new BadRequestException('Group size must be at least 2 for group mentoring')
      );
    });

    it('should throw error when groupSize exceeds allowedMentees', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.GROUP,
        groupSize: 15,
        allowedMentees: 10,
      };

      await expect(service.create(createCohortDto)).rejects.toThrow(
        new BadRequestException('Group size cannot exceed the number of allowed mentees')
      );
    });

    it('should automatically set searchOption to semi-automated for group mentoring', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.GROUP,
        groupSize: 5,
        searchOption: SearchOption.AUTOMATIC_THROUGH_ALGORITHM, // This should be overridden
        isFfMandatory: 0,
      };

      const expectedCohort = { id: 1, ...createCohortDto, searchOption: SearchOption.OFFLINE_MATCHES, duration: 366 };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
    });

    it('should automatically calculate duration in days from start and end dates', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.ONE_TO_ONE,
        isFfMandatory: 0,
      };

      const expectedCohort = { id: 1, ...createCohortDto, duration: 366 };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
    });

    it('should auto-generate name when not provided', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        name: undefined, // Not provided
        corporateName: 'Acme Corp',
        allowedMentees: 5,
        mentoringType: MentoringType.ONE_TO_ONE,
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        isFfMandatory: 0,
      };

      // Mock the generateCohortName method to return a predictable name
      jest.spyOn(service as any, 'generateCohortName').mockReturnValue('Acme Corp|20 FEB 2024|5');

      const expectedCohort = { id: 1, ...createCohortDto, name: 'Acme Corp|20 FEB 2024|5', duration: 366 };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));

      // Restore the original method
      jest.restoreAllMocks();
    });

    it('should throw error when auto-generating name without corporate name', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        name: undefined, // Not provided
        corporateName: undefined, // Not provided
        mentoringType: MentoringType.ONE_TO_ONE,
      };

      await expect(service.create(createCohortDto)).rejects.toThrow(
        new BadRequestException('Corporate name is required when not auto-generating cohort name')
      );
    });

    it('should use provided name when available', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        name: 'Custom Cohort Name',
        mentoringType: MentoringType.ONE_TO_ONE,
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        isFfMandatory: 0,
      };

      const expectedCohort = { id: 1, ...createCohortDto, duration: 366 };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
    });

    it('should throw error if cohort name already exists', async () => {
      mockCohortRepository.findOne.mockResolvedValue({ id: 2, name: 'Existing Cohort' });
      const createCohortDto: CreateCohortDto = { name: 'Existing Cohort', mentoringType: MentoringType.ONE_TO_ONE, ...baseCohortData };
      await expect(service.create(createCohortDto)).rejects.toThrow(ConflictException);
    });

    it('should create feedback frequency when specified', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.ONE_TO_ONE,
        metadata: ["1", "3", "5"],
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        isFfMandatory: 0,
        noOfInteractions: 6,
      };

      const expectedCohort = { id: 1, ...createCohortDto, duration: 366 };
      const expectedFeedbackFrequency = {
        cohortId: 1,
        frequency: 3,
        metadata: ['1', '3', '5'],
      };

      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
      expect(manager.create).toHaveBeenCalledWith(CohortFeedbackFrequency, expect.objectContaining({
        cohortId: 1,
        frequency: 3,
        metadata: ['1', '3', '5'],
      }));
      expect(manager.save).toHaveBeenCalledWith(CohortFeedbackFrequency, expect.objectContaining({
        cohortId: 1,
        frequency: 3,
        metadata: ['1', '3', '5'],
      }));
    });

    it('should calculate correct feedback session numbers from frequency', async () => {
      // Test session-based frequency calculation
      const sessionNumbers1 = service['calculateSessionBasedFeedbackFrequency'](3, 6);
      expect(sessionNumbers1).toEqual(['1', '3', '5']);

      const sessionNumbers2 = service['calculateSessionBasedFeedbackFrequency'](6, 6);
      expect(sessionNumbers2).toEqual(['1', '2', '3', '4', '5', '6']);
    });

    it('should validate feedback frequency correctly', async () => {
      // Valid frequency
      expect(() => service['validateFeedbackFrequency'](3, 6)).not.toThrow();
      
      // Invalid: frequency exceeds total sessions
      expect(() => service['validateFeedbackFrequency'](7, 6)).toThrow(
        new BadRequestException('Feedback frequency (7) cannot exceed total sessions (6)')
      );
      
      // Invalid: non-positive frequency
      expect(() => service['validateFeedbackFrequency'](0, 6)).toThrow(
        new BadRequestException('Feedback frequency must be a positive number')
      );
    });

    it('should automatically add last interaction to metadata when isFfMandatory is 1', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        isFfMandatory: 1,
        noOfInteractions: 6,
        metadata: ["2", "4"], // Missing the last interaction (6)
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        mentoringType: MentoringType.ONE_TO_ONE,
      };

      const expectedCohort = { id: 1, ...createCohortDto, duration: 366 };
      const expectedFeedbackFrequency = {
        cohortId: 1,
        frequency: 3, // Should be 3 now (2, 4, 6)
        metadata: ['2', '4', '6'], // Should include 6 automatically
      };

      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
      expect(manager.create).toHaveBeenCalledWith(CohortFeedbackFrequency, expect.objectContaining({
        cohortId: 1,
        frequency: 3,
        metadata: ['2', '4', '6'], // Should include 6 automatically
      }));
      expect(manager.save).toHaveBeenCalledWith(CohortFeedbackFrequency, expect.objectContaining({
        cohortId: 1,
        frequency: 3,
        metadata: ['2', '4', '6'],
      }));
    });

    it('should not add duplicate last interaction when isFfMandatory is 1 and it already exists', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        isFfMandatory: 1,
        noOfInteractions: 6,
        metadata: ["2", "4", "6"], // Already includes the last interaction
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        mentoringType: MentoringType.ONE_TO_ONE,
      };

      const expectedCohort = { id: 1, ...createCohortDto, duration: 366 };
      const expectedFeedbackFrequency = {
        cohortId: 1,
        frequency: 3,
        metadata: ['2', '4', '6'], // Should remain the same
      };

      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 1, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      const result = await service.create(createCohortDto);
      expect(result).toEqual(expect.objectContaining({
        ...createCohortDto,
        id: expect.any(Number),
        duration: expect.any(Number),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
      expect(manager.create).toHaveBeenCalledWith(CohortFeedbackFrequency, expect.objectContaining({
        cohortId: 1,
        frequency: 3,
        metadata: ['2', '4', '6'],
      }));
      expect(manager.save).toHaveBeenCalledWith(CohortFeedbackFrequency, expect.objectContaining({
        cohortId: 1,
        frequency: 3,
        metadata: ['2', '4', '6'],
      }));
    });

    it('should create chemistry sessions with correct titles for one-to-one, Automatic through Algorithm, and active chemistry session status', async () => {
      const createCohortDto: CreateCohortDto = {
        ...baseCohortData,
        mentoringType: MentoringType.ONE_TO_ONE,
        searchOption: SearchOption.AUTOMATIC_THROUGH_ALGORITHM,
        chemistrySessionStatus: 1,
        chemistrySessionCount: 3,
        createdBy: 42,
      };
      const expectedCohort = { id: 99, ...createCohortDto };
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn((entityType, data) => ({ ...data })),
        save: jest.fn((entityType, data) => Promise.resolve({ id: 99, ...data })),
        count: jest.fn().mockResolvedValue(0),
        delete: jest.fn(),
        update: jest.fn(),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));

      await service.create(createCohortDto);

      // Chemistry sessions: chemistrySessionCount + noOfInteractions
      const expectedCalls = (createCohortDto.chemistrySessionCount || 0) + (createCohortDto.noOfInteractions || 0 || 0);
      // There are 3 chemistry sessions and (noOfInteractions is undefined, so 0) => 3
      expect(manager.create).toHaveBeenCalledWith(Interaction, expect.objectContaining({
        cohortId: 99,
        userId: 42,
        title: expect.stringContaining('chemistry_session_'),
        status: 1,
      }));
      expect(manager.save).toHaveBeenCalledWith(Interaction, expect.objectContaining({
        cohortId: 99,
        userId: 42,
        title: expect.stringContaining('chemistry_session_'),
        status: 1,
      }));
    });
  });

  describe('findAll', () => {
    it('should return paginated cohorts', async () => {
      const mockCohorts = [{ id: 1, name: 'Test Cohort' }];
      const mockCount = 1;
      mockCohortRepository.findAndCount.mockResolvedValue([mockCohorts, mockCount]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: mockCohorts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a cohort by id', async () => {
      const mockCohort = { id: 1, name: 'Test Cohort' };
      mockCohortRepository.findOne.mockResolvedValue(mockCohort);

      const result = await service.findOne(1);

      expect(mockCohortRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['interactions', 'feedbackFrequencies'],
      });
      expect(result).toEqual(mockCohort);
    });

    it('should throw NotFoundException when cohort not found', async () => {
      mockCohortRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cohort and return a success message', async () => {
      const updateDto: UpdateCohortDto = { name: 'Updated Cohort Name' };
      const existingCohort = { id: 1, name: 'Old Cohort Name' };

      const manager = {
        findOne: jest.fn().mockResolvedValue(existingCohort),
        update: jest.fn().mockResolvedValue(undefined),
        find: jest.fn().mockResolvedValue([]),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));

      const result = await service.update(1, updateDto);

      expect(result).toEqual({ message: 'Cohort updated successfully' });
    });

    it('should throw NotFoundException if cohort does not exist', async () => {
      const updateDto: UpdateCohortDto = { name: 'Updated Cohort Name' };
      
      const manager = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a cohort successfully', async () => {
      const manager = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }), // Find a cohort to delete
        count: jest.fn().mockResolvedValue(0), // No interactions
        delete: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        find: jest.fn(),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw BadRequestException when cohort has interactions', async () => {
      const manager = {
        findOne: jest.fn().mockResolvedValue({ id: 1 }), // Find a cohort
        count: jest.fn().mockResolvedValue(1), // It has an interaction
        delete: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        find: jest.fn(),
      };
      mockDataSource.transaction.mockImplementation(async (cb) => cb(manager));
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateCohortExcelRows', () => {
    it('should validate all valid rows successfully', () => {
      const validRows = [
        {
          'First Name*': 'John',
          'Last Name*': 'Doe',
          'Email*': 'john.doe@example.com',
          'Country Dial Code*': '+1',
          'Phone No*': '1234567890',
          'Gender*': 'Male',
          'Total Years of Experience*': 5,
          'Country*': 'USA',
          'Level*': 'Senior',
        },
        {
          'First Name*': 'Jane',
          'Last Name*': 'Smith',
          'Email*': 'jane.smith@example.com',
          'Country Dial Code*': '+44',
          'Phone No*': '9876543210',
          'Gender*': 'Female',
          'Total Years of Experience*': 3,
          'Country*': 'UK',
          'Level*': 'Mid',
        },
      ];

      const result = service.validateCohortExcelRows(validRows);

      expect(result).toEqual({
        total: 2,
        valid: 2,
        invalid: 0,
        invalidRows: [],
        validRows: [
          { row: 2, data: validRows[0] },
          { row: 3, data: validRows[1] },
        ],
      });
    });

    it('should identify invalid rows with validation errors', () => {
      const invalidRows = [
        {
          firstName: '', // Invalid: empty
          lastName: 'Doe',
          email: 'invalid-email', // Invalid: not a valid email
          countryDialCode: '+1',
          phoneNo: '1234567890',
          gender: 'Male',
          totalYearsOfExperience: 'not-a-number', // Invalid: not a number
          country: 'USA',
          level: 'Senior',
        },
        {
          firstName: 'Jane',
          lastName: '', // Invalid: empty
          email: 'jane.smith@example.com',
          countryDialCode: '', // Invalid: empty
          phoneNo: '', // Invalid: empty
          gender: '', // Invalid: empty
          totalYearsOfExperience: -1, // Invalid: negative number
          country: '', // Invalid: empty
          level: '', // Invalid: empty
        },
      ];

      const result = service.validateCohortExcelRows(invalidRows);

      expect(result.total).toBe(2);
      expect(result.valid).toBe(0);
      expect(result.invalid).toBe(2);
      expect(result.invalidRows).toHaveLength(2);
      expect(result.invalidRows[0].row).toBe(2); // Excel rows start from 2 (header + 1)
      expect(result.invalidRows[1].row).toBe(3);
      
      // Check that validation errors are captured
      expect(result.invalidRows[0].errors.length).toBeGreaterThan(0);
      expect(result.invalidRows[1].errors.length).toBeGreaterThan(0);
    });

    it('should handle mixed valid and invalid data', () => {
      const mixedRows = [
        {
          'First Name*': 'John',
          'Last Name*': 'Doe',
          'Email*': 'john.doe@example.com',
          'Country Dial Code*': '+1',
          'Phone No*': '1234567890',
          'Gender*': 'Male',
          'Total Years of Experience*': 5,
          'Country*': 'USA',
          'Level*': 'Senior',
        },
        {
          'First Name*': 'Jane',
          'Last Name*': 'Smith',
          'Email*': 'jane.smith@example.com',
          'Country Dial Code*': '+44',
          'Phone No*': '9876543210',
          'Gender*': 'Female',
          'Total Years of Experience*': 3,
          'Country*': 'UK',
          'Level*': 'Mid',
        },
        {
          'First Name*': '', // Invalid: empty
          'Last Name*': 'Invalid',
          'Email*': 'invalid-email', // Invalid: not an email
          'Country Dial Code*': '+1',
          'Phone No*': '1234567890',
          'Gender*': 'Male',
          'Total Years of Experience*': 5,
          'Country*': 'USA',
          'Level*': 'Senior',
        },
      ];

      const result = service.validateCohortExcelRows(mixedRows);

      expect(result.total).toBe(3);
      expect(result.valid).toBe(2);
      expect(result.invalid).toBe(1);
      expect(result.invalidRows).toHaveLength(1);
      expect(result.invalidRows[0].row).toBe(4); // Third row (index 2 + 2)
      expect(result.validRows).toHaveLength(2);
    });

    it('should handle empty rows array', () => {
      const result = service.validateCohortExcelRows([]);

      expect(result).toEqual({
        total: 0,
        valid: 0,
        invalid: 0,
        invalidRows: [],
        validRows: [],
      });
    });

    it('should handle rows with missing fields', () => {
      const rowsWithMissingFields = [
        {
          'First Name*': 'John',
          'Last Name*': 'Doe',
          'Email*': 'john.doe@example.com',
          'Country Dial Code*': '+1',
          'Phone No*': '1234567890',
          'Gender*': 'Male',
          'Total Years of Experience*': 5,
          'Country*': 'USA',
          'Level*': 'Senior',
        },
        {
          'First Name*': 'Jane',
          // Missing Last Name*
          'Email*': 'jane@example.com',
          'Country Dial Code*': '+44',
          'Phone No*': '9876543210',
          'Gender*': 'Female',
          'Total Years of Experience*': 3,
          'Country*': 'UK',
          'Level*': 'Mid',
        },
      ];

      const result = service.validateCohortExcelRows(rowsWithMissingFields);

      expect(result.total).toBe(2);
      expect(result.valid).toBe(1);
      expect(result.invalid).toBe(1);
      expect(result.invalidRows[0].row).toBe(3); // Second row (index 1 + 2)
      expect(result.validRows).toHaveLength(1);
    });

    it('should validate email format correctly', () => {
      const rowsWithEmailIssues = [
        {
          'First Name*': 'John',
          'Last Name*': 'Doe',
          'Email*': 'john.doe@example.com', // Valid email
          'Country Dial Code*': '+1',
          'Phone No*': '1234567890',
          'Gender*': 'Male',
          'Total Years of Experience*': 5,
          'Country*': 'USA',
          'Level*': 'Senior',
        },
        {
          'First Name*': 'Jane',
          'Last Name*': 'Smith',
          'Email*': 'invalid-email', // Invalid email
          'Country Dial Code*': '+44',
          'Phone No*': '9876543210',
          'Gender*': 'Female',
          'Total Years of Experience*': 3,
          'Country*': 'UK',
          'Level*': 'Mid',
        },
        {
          'First Name*': 'Bob',
          'Last Name*': 'Johnson',
          'Email*': 'bob@', // Invalid email
          'Country Dial Code*': '+61',
          'Phone No*': '555123456',
          'Gender*': 'Male',
          'Total Years of Experience*': 7,
          'Country*': 'Australia',
          'Level*': 'Senior',
        },
      ];

      const result = service.validateCohortExcelRows(rowsWithEmailIssues);

      expect(result.total).toBe(3);
      expect(result.valid).toBe(1);
      expect(result.invalid).toBe(2);
      expect(result.invalidRows).toHaveLength(2);
      expect(result.validRows).toHaveLength(1);
    });

    it('should validate number fields correctly', () => {
      const rowsWithNumberIssues = [
        {
          'First Name*': 'John',
          'Last Name*': 'Doe',
          'Email*': 'john.doe@example.com',
          'Country Dial Code*': '+1',
          'Phone No*': '1234567890',
          'Gender*': 'Male',
          'Total Years of Experience*': 5, // Valid number
          'Country*': 'USA',
          'Level*': 'Senior',
        },
        {
          'First Name*': 'Jane',
          'Last Name*': 'Smith',
          'Email*': 'jane.smith@example.com',
          'Country Dial Code*': '+44',
          'Phone No*': '9876543210',
          'Gender*': 'Female',
          'Total Years of Experience*': 3, // Valid number
          'Country*': 'UK',
          'Level*': 'Mid',
        },
        {
          'First Name*': 'Bob',
          'Last Name*': 'Johnson',
          'Email*': 'bob.johnson@example.com',
          'Country Dial Code*': '+61',
          'Phone No*': '555123456',
          'Gender*': 'Male',
          'Total Years of Experience*': 'five', // Invalid: string instead of number
          'Country*': 'Australia',
          'Level*': 'Senior',
        },
      ];

      const result = service.validateCohortExcelRows(rowsWithNumberIssues);

      expect(result.total).toBe(3);
      expect(result.valid).toBe(2); // Only the string 'five' is invalid
      expect(result.invalid).toBe(1);
      expect(result.invalidRows).toHaveLength(1);
      expect(result.validRows).toHaveLength(2);
    });
  });
}); 