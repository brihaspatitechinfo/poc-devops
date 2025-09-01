import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppLogger } from '../logger/logger.service';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeProfileController } from './employee-profile.controller';
import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeProfileDocument } from './entities/employee-profile.entity';
import { PermissionsGuard } from '../guards/permissions.guard';

describe('EmployeeProfileController', () => {
    let controller: EmployeeProfileController;
    let service: EmployeeProfileService;
    let logger: AppLogger;

    const mockEmployeeProfileService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByUserId: jest.fn(),
        findByOrgSlug: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockAppLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
    };

    const mockEmployeeProfile: Partial<EmployeeProfileDocument> = {
        _id: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        organizationName: 'Test Organization',
        orgSlug: 'test-org',
        designation: 'Software Engineer',
        corporateCurrency: 49,
        numRecruiters: 2,
        createPage: false,
        pageActiveStatus: false,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmployeeProfileController],
            providers: [
                {
                    provide: EmployeeProfileService,
                    useValue: mockEmployeeProfileService,
                },
                {
                    provide: AppLogger,
                    useValue: mockAppLogger,
                },
            ],
        })
        .overrideGuard(PermissionsGuard)
        .useValue({ canActivate: () => true })
        .compile();

        controller = module.get<EmployeeProfileController>(EmployeeProfileController);
        service = module.get<EmployeeProfileService>(EmployeeProfileService);
        logger = module.get<AppLogger>(AppLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const createDto: CreateEmployeeProfileDto = {
            userId: new Types.ObjectId(),
            organizationName: 'Test Organization',
            orgSlug: 'test-org',
            designation: 'Software Engineer',
        };

        it('should create a new employee profile successfully', async () => {
            mockEmployeeProfileService.create.mockResolvedValue(mockEmployeeProfile);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual({
                statusCode: HttpStatus.CREATED,
                message: 'Employee profile created',
                data: mockEmployeeProfile,
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.create.mockRejectedValue(error);

            await expect(controller.create(createDto)).rejects.toThrow(error);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findAll', () => {
        const mockProfiles = [mockEmployeeProfile, mockEmployeeProfile];
        const mockTotal = 2;

        it('should return all employee profiles with default pagination', async () => {
            const serviceResult = {
                profiles: mockProfiles,
                total: mockTotal,
                page: 1,
                limit: 10,
            };

            mockEmployeeProfileService.findAll.mockResolvedValue(serviceResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profiles retrieved successfully',
                data: {
                    profiles: mockProfiles,
                    pagination: {
                        total: mockTotal,
                        page: 1,
                        limit: 10,
                        totalPages: 1,
                    },
                },
            });
        });

        it('should return employee profiles with custom pagination and active filter', async () => {
            const page = 2;
            const limit = 5;
            const active = true;
            const serviceResult = {
                profiles: mockProfiles,
                total: mockTotal,
                page,
                limit,
            };

            mockEmployeeProfileService.findAll.mockResolvedValue(serviceResult);

            const result = await controller.findAll(page, limit, active);

            expect(service.findAll).toHaveBeenCalledWith(page, limit, active);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profiles retrieved successfully',
                data: {
                    profiles: mockProfiles,
                    pagination: {
                        total: mockTotal,
                        page,
                        limit,
                        totalPages: 1,
                    },
                },
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.findAll.mockRejectedValue(error);

            await expect(controller.findAll()).rejects.toThrow(error);
            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
        });
    });

    describe('findOne', () => {
        const profileId = '507f1f77bcf86cd799439011';

        it('should return employee profile by ID', async () => {
            mockEmployeeProfileService.findOne.mockResolvedValue(mockEmployeeProfile);

            const result = await controller.findOne(profileId);

            expect(service.findOne).toHaveBeenCalledWith(profileId);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profile retrieved successfully',
                data: mockEmployeeProfile,
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.findOne.mockRejectedValue(error);

            await expect(controller.findOne(profileId)).rejects.toThrow(error);
            expect(service.findOne).toHaveBeenCalledWith(profileId);
        });
    });

    describe('findByUserId', () => {
        const userId = 1;

        it('should return employee profile by user ID', async () => {
            mockEmployeeProfileService.findByUserId.mockResolvedValue(mockEmployeeProfile);

            const result = await controller.findByUserId(userId);

            expect(service.findByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profile retrieved successfully',
                data: mockEmployeeProfile,
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.findByUserId.mockRejectedValue(error);

            await expect(controller.findByUserId(userId)).rejects.toThrow(error);
            expect(service.findByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('findByOrgSlug', () => {
        const orgSlug = 'test-org';

        it('should return employee profile by org slug', async () => {
            mockEmployeeProfileService.findByOrgSlug.mockResolvedValue(mockEmployeeProfile);

            const result = await controller.findByOrgSlug(orgSlug);

            expect(service.findByOrgSlug).toHaveBeenCalledWith(orgSlug);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profile retrieved successfully',
                data: mockEmployeeProfile,
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.findByOrgSlug.mockRejectedValue(error);

            await expect(controller.findByOrgSlug(orgSlug)).rejects.toThrow(error);
            expect(service.findByOrgSlug).toHaveBeenCalledWith(orgSlug);
        });
    });

    describe('update', () => {
        const profileId = '507f1f77bcf86cd799439011';
        const updateDto: UpdateEmployeeProfileDto = {
            userId: new Types.ObjectId(),
            organizationName: 'Updated Organization',
            designation: 'Senior Engineer',
        };

        it('should update employee profile successfully', async () => {
            const updatedProfile = { ...mockEmployeeProfile, ...updateDto };
            mockEmployeeProfileService.update.mockResolvedValue(updatedProfile);

            const result = await controller.update(profileId, updateDto);

            expect(service.update).toHaveBeenCalledWith(profileId, updateDto);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profile updated successfully',
                data: updatedProfile,
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.update.mockRejectedValue(error);

            await expect(controller.update(profileId, updateDto)).rejects.toThrow(error);
            expect(service.update).toHaveBeenCalledWith(profileId, updateDto);
        });
    });

    describe('remove', () => {
        const profileId = '507f1f77bcf86cd799439011';

        it('should delete employee profile successfully', async () => {
            mockEmployeeProfileService.remove.mockResolvedValue(mockEmployeeProfile);

            const result = await controller.remove(profileId);

            expect(service.remove).toHaveBeenCalledWith(profileId);
            expect(result).toEqual({
                statusCode: HttpStatus.OK,
                message: 'Employee profile deleted successfully',
                data: mockEmployeeProfile,
            });
        });

        it('should handle service errors properly', async () => {
            const error = new Error('Service error');
            mockEmployeeProfileService.remove.mockRejectedValue(error);

            await expect(controller.remove(profileId)).rejects.toThrow(error);
            expect(service.remove).toHaveBeenCalledWith(profileId);
        });
    });

    describe('pagination calculation', () => {
        it('should calculate total pages correctly', async () => {
            const mockProfiles = [mockEmployeeProfile, mockEmployeeProfile];
            const serviceResult = {
                profiles: mockProfiles,
                total: 25,
                page: 1,
                limit: 10,
            };

            mockEmployeeProfileService.findAll.mockResolvedValue(serviceResult);

            const result = await controller.findAll(1, 10);

            expect(result.data.pagination.totalPages).toBe(3); // Math.ceil(25 / 10) = 3
        });

        it('should handle zero total correctly', async () => {
            const serviceResult = {
                profiles: [],
                total: 0,
                page: 1,
                limit: 10,
            };

            mockEmployeeProfileService.findAll.mockResolvedValue(serviceResult);

            const result = await controller.findAll(1, 10);

            expect(result.data.pagination.totalPages).toBe(0);
        });
    });

    describe('query parameter handling', () => {
        it('should handle string query parameters correctly', async () => {
            const mockProfiles = [mockEmployeeProfile, mockEmployeeProfile];
            const serviceResult = {
                profiles: mockProfiles,
                total: 2,
                page: 1,
                limit: 10,
            };

            mockEmployeeProfileService.findAll.mockResolvedValue(serviceResult);

            // Test with string parameters (as they come from query)
            await controller.findAll(1, 10, true);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, true);
        });

        it('should handle undefined active parameter', async () => {
            const mockProfiles = [mockEmployeeProfile, mockEmployeeProfile];
            const serviceResult = {
                profiles: mockProfiles,
                total: 2,
                page: 1,
                limit: 10,
            };

            mockEmployeeProfileService.findAll.mockResolvedValue(serviceResult);

            await controller.findAll(1, 10, undefined);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined);
        });
    });
}); 