import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeProfile, EmployeeProfileDocument } from './entities/employee-profile.entity';

describe('EmployeeProfileService', () => {
    let service: EmployeeProfileService;
    let model: Model<EmployeeProfileDocument>;
    let configService: ConfigService;

    const mockEmployeeProfileModel = {
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        find: jest.fn(),
        countDocuments: jest.fn(),
        lean: jest.fn(),
        exec: jest.fn(),
        skip: jest.fn(),
        limit: jest.fn(),
        save: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
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
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmployeeProfileService,
                {
                    provide: getModelToken(EmployeeProfile.name),
                    useValue: mockEmployeeProfileModel,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<EmployeeProfileService>(EmployeeProfileService);
        model = module.get<Model<EmployeeProfileDocument>>(getModelToken(EmployeeProfile.name));
        configService = module.get<ConfigService>(ConfigService);
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
            const mockNewProfile = {
                ...mockEmployeeProfile,
                ...createDto,
                save: jest.fn().mockResolvedValue(mockEmployeeProfile),
            };

            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            // Mock the model constructor
            const mockModel = jest.fn().mockReturnValue(mockNewProfile);
            jest.spyOn(model, 'constructor' as any).mockImplementation(mockModel);

            const result = await service.create(createDto);

            expect(mockEmployeeProfileModel.findOne).toHaveBeenCalledWith({
                $or: [{ userId: expect.any(Types.ObjectId) }, { orgSlug: createDto.orgSlug }],
            });
            expect(result).toEqual(mockEmployeeProfile);
        });

        it('should throw ConflictException when userId already exists', async () => {
            const existingProfile = {
                userId: createDto.userId,
                orgSlug: 'different-org',
            };

            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingProfile),
            });

            await expect(service.create(createDto)).rejects.toThrow(
                new ConflictException(`Employee profile with user ID '${createDto.userId}' already exists`),
            );
        });

        it('should throw ConflictException when orgSlug already exists', async () => {
            const existingProfile = {
                userId: 999,
                orgSlug: createDto.orgSlug,
            };

            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingProfile),
            });

            await expect(service.create(createDto)).rejects.toThrow(
                new ConflictException(`Employee profile with organization slug '${createDto.orgSlug}' already exists`),
            );
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        const mockProfiles = [mockEmployeeProfile, mockEmployeeProfile];
        const mockTotal = 2;

        it('should return all employee profiles with pagination', async () => {
            const page = 1;
            const limit = 10;

            mockEmployeeProfileModel.find.mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue(mockProfiles),
                    }),
                }),
            });
            mockEmployeeProfileModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockTotal),
            });

            const result = await service.findAll(page, limit);

            expect(result).toEqual({
                profiles: mockProfiles,
                total: mockTotal,
                page,
                limit,
            });
        });

        it('should filter by active status when provided', async () => {
            const page = 1;
            const limit = 10;
            const active = true;

            mockEmployeeProfileModel.find.mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue(mockProfiles),
                    }),
                }),
            });
            mockEmployeeProfileModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockTotal),
            });

            await service.findAll(page, limit, active);

            expect(mockEmployeeProfileModel.find).toHaveBeenCalledWith({ pageActiveStatus: active });
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.find.mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockRejectedValue(new Error('Database error')),
                    }),
                }),
            });

            await expect(service.findAll(1, 10)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        const profileId = '507f1f77bcf86cd799439011';

        it('should return employee profile by ID', async () => {
            mockEmployeeProfileModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockEmployeeProfile),
            });

            const result = await service.findOne(profileId);

            expect(mockEmployeeProfileModel.findById).toHaveBeenCalledWith(profileId);
            expect(result).toEqual(mockEmployeeProfile);
        });

        it('should throw NotFoundException when profile not found', async () => {
            mockEmployeeProfileModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findOne(profileId)).rejects.toThrow(
                new NotFoundException(`Employee profile with ID ${profileId} not found`),
            );
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.findById.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.findOne(profileId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findByUserId', () => {
        const userId = 1;

        it('should return employee profile by user ID', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockEmployeeProfile),
            });

            const result = await service.findByUserId(userId);

            expect(mockEmployeeProfileModel.findOne).toHaveBeenCalledWith({ userId: expect.any(Types.ObjectId) });
            expect(result).toEqual(mockEmployeeProfile);
        });

        it('should throw NotFoundException when profile not found', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findByUserId(userId)).rejects.toThrow(
                new NotFoundException(`Employee profile with user ID ${userId} not found`),
            );
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.findByUserId(userId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findByOrgSlug', () => {
        const orgSlug = 'test-org';

        it('should return employee profile by org slug', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockEmployeeProfile),
            });

            const result = await service.findByOrgSlug(orgSlug);

            expect(mockEmployeeProfileModel.findOne).toHaveBeenCalledWith({ orgSlug });
            expect(result).toEqual(mockEmployeeProfile);
        });

        it('should throw NotFoundException when profile not found', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findByOrgSlug(orgSlug)).rejects.toThrow(
                new NotFoundException(`Employee profile with organization slug ${orgSlug} not found`),
            );
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.findByOrgSlug(orgSlug)).rejects.toThrow(InternalServerErrorException);
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

            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            mockEmployeeProfileModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedProfile),
            });

            const result = await service.update(profileId, updateDto);

            expect(mockEmployeeProfileModel.findByIdAndUpdate).toHaveBeenCalledWith(
                profileId,
                expect.objectContaining(updateDto),
                { new: true },
            );
            expect(result).toEqual(updatedProfile);
        });

        it('should throw ConflictException when userId already exists in another profile', async () => {
            const updateDtoWithUserId: UpdateEmployeeProfileDto = {
                userId: new Types.ObjectId(),
                organizationName: 'Updated Organization',
            };

            const existingProfile = {
                userId: updateDtoWithUserId.userId,
                orgSlug: 'different-org',
            };

            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingProfile),
            });

            await expect(service.update(profileId, updateDtoWithUserId)).rejects.toThrow(
                new ConflictException(`Employee profile with user ID '${updateDtoWithUserId.userId}' already exists`),
            );
        });

        it('should throw ConflictException when orgSlug already exists in another profile', async () => {
            const updateDtoWithOrgSlug: UpdateEmployeeProfileDto = {
                userId: new Types.ObjectId(),
                orgSlug: 'existing-org',
                organizationName: 'Updated Organization',
            };

            const existingProfile = {
                userId: new Types.ObjectId(),
                orgSlug: updateDtoWithOrgSlug.orgSlug,
            };

            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingProfile),
            });

            await expect(service.update(profileId, updateDtoWithOrgSlug)).rejects.toThrow(
                new ConflictException(`Employee profile with organization slug '${updateDtoWithOrgSlug.orgSlug}' already exists`),
            );
        });

        it('should throw NotFoundException when profile not found', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            mockEmployeeProfileModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.update(profileId, updateDto)).rejects.toThrow(
                new NotFoundException(`Employee profile with ID ${profileId} not found`),
            );
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.findOne.mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.update(profileId, updateDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('remove', () => {
        const profileId = '507f1f77bcf86cd799439011';

        it('should delete employee profile successfully', async () => {
            mockEmployeeProfileModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockEmployeeProfile),
            });

            const result = await service.remove(profileId);

            expect(mockEmployeeProfileModel.findByIdAndDelete).toHaveBeenCalledWith(profileId);
            expect(result).toEqual(mockEmployeeProfile);
        });

        it('should throw NotFoundException when profile not found', async () => {
            mockEmployeeProfileModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.remove(profileId)).rejects.toThrow(
                new NotFoundException(`Employee profile with ID ${profileId} not found`),
            );
        });

        it('should throw InternalServerErrorException when database operation fails', async () => {
            mockEmployeeProfileModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.remove(profileId)).rejects.toThrow(InternalServerErrorException);
        });
    });
}); 