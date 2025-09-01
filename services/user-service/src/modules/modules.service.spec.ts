import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module, ModuleDocument } from './entities/module.entity';
import { ModulesService } from './modules.service';

describe('ModulesService', () => {
    let service: ModulesService;
    let moduleModel: Model<ModuleDocument>;
    let configService: ConfigService;

    const mockModule = {
        _id: '665ffe123b7a4b0df8f12345',
        name: 'User Management',
        slug: 'mod_user_mgmt',
        description: 'Top-level user module',
        subModules: [
            {
                name: 'Cohort',
                slug: 'cohort',
                description: 'Cohort management',
                isActive: true,
            },
        ],
        isActive: true,
        createdAt: new Date('2025-06-20T09:32:11.123Z'),
        updatedAt: new Date('2025-06-20T09:32:11.123Z'),
    };

    const mockModuleModel = {
        new: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn(),
        exec: jest.fn(),
        lean: jest.fn(),
        skip: jest.fn(),
        limit: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ModulesService,
                {
                    provide: getModelToken(Module.name),
                    useValue: mockModuleModel,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<ModulesService>(ModulesService);
        moduleModel = module.get<Model<ModuleDocument>>(getModelToken(Module.name));
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createModuleDto: CreateModuleDto = {
            name: 'User Management',
            slug: 'mod_user_mgmt',
            description: 'Top-level user module',
            subModules: [
                {
                    name: 'Cohort',
                    slug: 'cohort',
                    description: 'Cohort management',
                    isActive: true,
                },
            ],
            isActive: true,
        };

        it('should create a new module successfully', async () => {
            const mockCreatedModule = {
                ...mockModule,
                save: jest.fn().mockResolvedValue(mockModule),
            };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            mockModuleModel.new.mockReturnValue(mockCreatedModule);

            const result = await service.create(createModuleDto);

            expect(mockModuleModel.findOne).toHaveBeenCalledWith({
                $or: [{ name: createModuleDto.name }, { slug: createModuleDto.slug }],
            });
            expect(mockModuleModel.new).toHaveBeenCalledWith(createModuleDto);
            expect(mockCreatedModule.save).toHaveBeenCalled();
            expect(result).toEqual(mockModule);
        });

        it('should throw ConflictException when module with same name exists', async () => {
            const existingModule = {
                name: 'User Management',
                slug: 'different_slug',
            };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingModule),
            });

            await expect(service.create(createModuleDto)).rejects.toThrow(
                ConflictException,
            );
            expect(mockModuleModel.findOne).toHaveBeenCalledWith({
                $or: [{ name: createModuleDto.name }, { slug: createModuleDto.slug }],
            });
        });

        it('should throw ConflictException when module with same slug exists', async () => {
            const existingModule = {
                name: 'Different Name',
                slug: 'mod_user_mgmt',
            };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingModule),
            });

            await expect(service.create(createModuleDto)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            const dbError = new Error('Database connection failed');

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockRejectedValue(dbError),
            });

            await expect(service.create(createModuleDto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findAll', () => {
        it('should return paginated modules with active filter', async () => {
            const page = 1;
            const limit = 10;
            const active = true;
            const total = 25;

            const mockQuery = {
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue([mockModule]),
                    }),
                }),
            };

            mockModuleModel.find.mockReturnValue(mockQuery);
            mockModuleModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(total),
            });

            const result = await service.findAll(page, limit, active);

            expect(mockModuleModel.find).toHaveBeenCalledWith({ isActive: true });
            expect(mockModuleModel.countDocuments).toHaveBeenCalledWith({ isActive: true });
            expect(result).toEqual({
                modules: [mockModule],
                total,
                page,
                limit,
            });
        });

        it('should return all modules when active filter is false', async () => {
            const page = 1;
            const limit = 10;
            const active = false;
            const total = 15;

            const mockQuery = {
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue([mockModule]),
                    }),
                }),
            };

            mockModuleModel.find.mockReturnValue(mockQuery);
            mockModuleModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(total),
            });

            const result = await service.findAll(page, limit, active);

            expect(mockModuleModel.find).toHaveBeenCalledWith({});
            expect(mockModuleModel.countDocuments).toHaveBeenCalledWith({});
            expect(result).toEqual({
                modules: [mockModule],
                total,
                page,
                limit,
            });
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            const dbError = new Error('Database connection failed');

            mockModuleModel.find.mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockRejectedValue(dbError),
                    }),
                }),
            });

            await expect(service.findAll(1, 10, true)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('findOne', () => {
        const moduleId = '665ffe123b7a4b0df8f12345';

        it('should return a module by ID successfully', async () => {
            mockModuleModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockModule),
            });

            const result = await service.findOne(moduleId);

            expect(mockModuleModel.findById).toHaveBeenCalledWith(moduleId);
            expect(result).toEqual(mockModule);
        });

        it('should throw NotFoundException when module not found', async () => {
            mockModuleModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findOne(moduleId)).rejects.toThrow(NotFoundException);
            expect(mockModuleModel.findById).toHaveBeenCalledWith(moduleId);
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            const dbError = new Error('Database connection failed');

            mockModuleModel.findById.mockReturnValue({
                exec: jest.fn().mockRejectedValue(dbError),
            });

            await expect(service.findOne(moduleId)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('update', () => {
        const moduleId = '665ffe123b7a4b0df8f12345';
        const updateModuleDto: UpdateModuleDto = {
            name: 'Updated User Management',
            description: 'Updated description',
        };

        it('should update a module successfully', async () => {
            const updatedModule = { ...mockModule, ...updateModuleDto };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            mockModuleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedModule),
            });

            const result = await service.update(moduleId, updateModuleDto);

            expect(mockModuleModel.findByIdAndUpdate).toHaveBeenCalledWith(
                moduleId,
                updateModuleDto,
                { new: true },
            );
            expect(result).toEqual(updatedModule);
        });

        it('should throw ConflictException when updating with existing name', async () => {
            const existingModule = {
                _id: 'different-id',
                name: 'Updated User Management',
                slug: 'different_slug',
            };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingModule),
            });

            await expect(service.update(moduleId, updateModuleDto)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should throw ConflictException when updating with existing slug', async () => {
            const updateDtoWithSlug: UpdateModuleDto = {
                name: 'Different Name',
                slug: 'existing_slug',
            };

            const existingModule = {
                _id: 'different-id',
                name: 'Different Name',
                slug: 'existing_slug',
            };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingModule),
            });

            await expect(service.update(moduleId, updateDtoWithSlug)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should not throw ConflictException when updating same module', async () => {
            const existingModule = {
                _id: moduleId,
                name: 'Updated User Management',
                slug: 'mod_user_mgmt',
            };

            const updatedModule = { ...mockModule, ...updateModuleDto };

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(existingModule),
            });
            mockModuleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedModule),
            });

            const result = await service.update(moduleId, updateModuleDto);

            expect(result).toEqual(updatedModule);
        });

        it('should throw NotFoundException when module not found', async () => {
            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });
            mockModuleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.update(moduleId, updateModuleDto)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            const dbError = new Error('Database connection failed');

            mockModuleModel.findOne.mockReturnValue({
                lean: jest.fn().mockRejectedValue(dbError),
            });

            await expect(service.update(moduleId, updateModuleDto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('remove', () => {
        const moduleId = '665ffe123b7a4b0df8f12345';

        it('should delete a module successfully', async () => {
            mockModuleModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockModule),
            });

            const result = await service.remove(moduleId);

            expect(mockModuleModel.findByIdAndDelete).toHaveBeenCalledWith(moduleId);
            expect(result).toEqual(mockModule);
        });

        it('should throw NotFoundException when module not found', async () => {
            mockModuleModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.remove(moduleId)).rejects.toThrow(NotFoundException);
            expect(mockModuleModel.findByIdAndDelete).toHaveBeenCalledWith(moduleId);
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            const dbError = new Error('Database connection failed');

            mockModuleModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockRejectedValue(dbError),
            });

            await expect(service.remove(moduleId)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });
}); 