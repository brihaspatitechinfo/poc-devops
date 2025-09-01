import { Test, TestingModule } from '@nestjs/testing';
import { CohortController } from './cohort.controller';
import { CohortService } from './cohort.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import {CohortStatus } from './enums/cohort.enums';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import * as XLSX from 'xlsx';

describe('CohortController', () => {
  let controller: CohortController;
  let service: CohortService;

  const mockCohortService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
    getCohortStats: jest.fn(),
    validateCohortExcelRows: jest.fn(),
    uploadCohortExcelAndRegisterMentees: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CohortController],
      providers: [
        {
          provide: CohortService,
          useValue: mockCohortService,
        },
      ],
    }).compile();

    controller = module.get<CohortController>(CohortController);
    service = module.get<CohortService>(CohortService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createCohortDto: CreateCohortDto = {
      name: 'Test Cohort',
      isInternal: false,
      organizationId: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      timezoneId: 1,
      duration: 30,
      sessionDurations: ["15", "30", "45", "60"],
      allowedMentees: 10,
      mentoringType: 1,
      groupSize: 1,
      price: '1000',
      noOfInteractions: 5,
      status: CohortStatus.ACTIVE,
      groupCreated: 0,
      mentorsMatched: 0,
      creationStatus: 1,
      cohortType: 1,
      assignCoachType: 0,
      searchOption: 1,
      minPrice: 500,
      maxPrice: 1500,
      isFfMandatory: 1,
      isUnlimited: 0,
      chemistrySessionCount: 1,
      chemistrySessionStatus: 0,
      month: 1,
      createdBy: 1,
      updatedBy: 1,
    };

    it('should create a cohort', async () => {
      const expectedCohort = { id: 1, ...createCohortDto };
      mockCohortService.create.mockResolvedValue(expectedCohort);

      const result = await controller.create(createCohortDto);

      expect(service.create).toHaveBeenCalledWith(createCohortDto);
      expect(result).toEqual({
        statusCode: 201,
        message: 'Cohort created successfully',
        data: expectedCohort
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated cohorts', async () => {
      const query = { page: 1, limit: 10 };
      const expectedResult = {
        data: [{ id: 1, name: 'Test Cohort' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockCohortService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Cohorts retrieved',
        data: expectedResult.data,
        total: expectedResult.total,
        page: expectedResult.page,
        limit: expectedResult.limit,
        totalPages: expectedResult.totalPages,
      });
    });
  });

  describe('findOne', () => {
    it('should return a cohort by id', async () => {
      const cohortId = '1';
      const expectedCohort = { id: 1, name: 'Test Cohort' };
      mockCohortService.findOne.mockResolvedValue(expectedCohort);

      const result = await controller.findOne(cohortId);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Cohort retrieved successfully',
        data: expectedCohort
      });
    });
  });

  describe('update', () => {
    it('should update a cohort', async () => {
      const updateDto = { name: 'Updated Cohort' };
      const expectedResponse = {
        statusCode: 200,
        message: 'Cohort updated successfully'
      };
      // Mock the service to return the success message
      mockCohortService.update.mockResolvedValue({ message: 'Cohort updated successfully' });

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('remove', () => {
    it('should remove a cohort', async () => {
      const cohortId = '1';
      mockCohortService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(cohortId);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 204,
        message: 'Cohort deleted successfully',
        data: null
      });
    });
  });

  describe('uploadCohortExcel', () => {
    it('should handle file upload successfully', async () => {
      const cohortId = '1';
      const mockFile = {
        buffer: Buffer.from('test file content'),
        originalname: 'test.xlsx',
      };

      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      const mockExcelData = [
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
      ];

      const mockValidationResult = {
        totalRows: 1,
        savedUsers: mockExcelData,
        existingUsers: [],
      };

      jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkbook as any);
      jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(mockExcelData as any);
      mockCohortService.uploadCohortExcelAndRegisterMentees.mockResolvedValue(mockValidationResult);

      const result = await controller.uploadCohortExcel(mockFile as any, cohortId);

      expect(XLSX.read).toHaveBeenCalledWith(mockFile.buffer, { type: 'buffer' });
      expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith(mockWorkbook.Sheets['Sheet1'], { defval: '' });
      expect(service.uploadCohortExcelAndRegisterMentees).toHaveBeenCalledWith(mockExcelData, cohortId);
      expect(result).toEqual({
        statusCode: 200,
        savedUsers: mockValidationResult.savedUsers,
        existingUsers: mockValidationResult.existingUsers,
        totalRows: mockValidationResult.totalRows,
      });
    });

    it('should return error when no file uploaded', async () => {
      const cohortId = '1';
      const result = await controller.uploadCohortExcel(undefined, cohortId);

      expect(result).toEqual({
        statusCode: 400,
        message: 'No file uploaded',
        data: null   
      });
    });

    it('should handle Excel parsing errors gracefully', async () => {
      const cohortId = '1';
      const mockFile = {
        buffer: Buffer.from('invalid excel content'),
        originalname: 'test.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };

      // Mock XLSX.read to throw an error
      jest.spyOn(XLSX, 'read').mockImplementation(() => {
        throw new Error('Invalid Excel file');
      });

      await expect(controller.uploadCohortExcel(mockFile as any, cohortId)).rejects.toThrow('Invalid Excel file');
    });

    it('should handle empty Excel file', async () => {
      const cohortId = '1';
      const mockFile = {
        buffer: Buffer.from('empty file'),
        originalname: 'empty.xlsx',
      };

      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      const mockValidationResult = {
        totalRows: 0,
        data: [],
        userCreationResults: [],
      };

      jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkbook as any);
      jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue([]);
      mockCohortService.uploadCohortExcelAndRegisterMentees.mockResolvedValue(mockValidationResult);

      const result = await controller.uploadCohortExcel(mockFile as any, cohortId);

      expect(result).toMatchObject({
        statusCode: 200,
        savedUsers: mockValidationResult.data,
        existingUsers: mockValidationResult.userCreationResults,
        totalRows: mockValidationResult.totalRows,
      });
      expect(service.uploadCohortExcelAndRegisterMentees).toHaveBeenCalledWith([], cohortId);
    });

    it('should handle Excel file with multiple sheets', async () => {
      const cohortId = '1';
      const mockFile = {
        buffer: Buffer.from('multi-sheet file'),
        originalname: 'multi-sheet.xlsx',
      };

      const mockWorkbook = {
        SheetNames: ['Sheet1', 'Sheet2'],
        Sheets: {
          Sheet1: {},
          Sheet2: {},
        },
      };

      const mockExcelData = [
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
      ];

      const mockValidationResult = {
        totalRows: 1,
        savedUsers: mockExcelData,
        existingUsers: [],
      };

      jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkbook as any);
      jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(mockExcelData as any);
      mockCohortService.uploadCohortExcelAndRegisterMentees.mockResolvedValue(mockValidationResult);

      const result = await controller.uploadCohortExcel(mockFile as any, cohortId);

      // Should use the first sheet (Sheet1)
      expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith(mockWorkbook.Sheets['Sheet1'], { defval: '' });
      expect(result).toMatchObject({
        statusCode: 200,
        savedUsers: mockValidationResult.savedUsers,
        existingUsers: mockValidationResult.existingUsers,
        totalRows: mockValidationResult.totalRows,
      });
    });

    it('should handle different Excel file formats', async () => {
      const cohortId = '1';
      const mockFile = {
        buffer: Buffer.from('different format'),
        originalname: 'test.xls',
      };

      const mockWorkbook = {
        SheetNames: ['Sheet1'],
        Sheets: {
          Sheet1: {},
        },
      };

      const mockExcelData = [
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
      ];

      const mockValidationResult = {
        totalRows: 1,
        savedUsers: mockExcelData,
        existingUsers: [],
      };

      jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkbook as any);
      jest.spyOn(XLSX.utils, 'sheet_to_json').mockReturnValue(mockExcelData as any);
      mockCohortService.uploadCohortExcelAndRegisterMentees.mockResolvedValue(mockValidationResult);

      const result = await controller.uploadCohortExcel(mockFile as any, cohortId);

      expect(XLSX.read).toHaveBeenCalledWith(mockFile.buffer, { type: 'buffer' });
      expect(result).toMatchObject({
        statusCode: 200,
        savedUsers: mockValidationResult.savedUsers,
        existingUsers: mockValidationResult.existingUsers,
        totalRows: mockValidationResult.totalRows,
      });
    });
  });
}); 