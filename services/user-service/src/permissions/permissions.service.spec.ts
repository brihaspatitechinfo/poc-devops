import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
    let service: PermissionsService;
    let permissionModel: Model<PermissionDocument>;
    let usersService: UsersService;

    let mockPermissionDocument: any;
    let mockPermissionModel: any;

    beforeEach(() => {
        mockPermissionDocument = {
            save: jest.fn(),
        };

        // Create a constructor function that returns the mock document
        const MockPermissionModel = jest.fn().mockImplementation(() => mockPermissionDocument);

        mockPermissionModel = {
            new: MockPermissionModel,
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn().mockReturnValue({
                exec: jest.fn(),
            }),
            findByIdAndDelete: jest.fn().mockReturnValue({
                exec: jest.fn(),
            }),
        };
    });

    const mockUsersService = {
        findOneByUserId: jest.fn(),
    };

    const mockPermission = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        action: 'create',
        module: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PermissionsService,
                {
                    provide: getModelToken(Permission.name),
                    useValue: mockPermissionModel,
                },
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        service = module.get<PermissionsService>(PermissionsService);
        permissionModel = module.get<Model<PermissionDocument>>(
            getModelToken(Permission.name),
        );
        usersService = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        const createPermissionDto: CreatePermissionDto = {
            name: 'Create User',
            description: 'Allows creation of new users',
            slug: 'user:create',
            module: 'user',
            action: 'create',
        };

        it('should create a permission successfully', async () => {
            const savedPermission = { ...mockPermission };
            mockPermissionDocument.save.mockResolvedValue(savedPermission);

            const result = await service.create(createPermissionDto);

            expect(mockPermissionModel.new).toHaveBeenCalledWith(createPermissionDto);
            expect(mockPermissionDocument.save).toHaveBeenCalled();
            expect(result).toEqual(savedPermission);
        });

        it('should throw InternalServerErrorException when save fails', async () => {
            const error = new Error('Database connection failed');
            mockPermissionDocument.save.mockRejectedValue(error);

            await expect(service.create(createPermissionDto)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.create(createPermissionDto)).rejects.toThrow(
                'An error occurred while creating the permission: Database connection failed',
            );
        });

        it('should handle validation errors during creation', async () => {
            const error = new Error('Validation failed: slug must be unique');
            mockPermissionDocument.save.mockRejectedValue(error);

            await expect(service.create(createPermissionDto)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.create(createPermissionDto)).rejects.toThrow(
                'An error occurred while creating the permission: Validation failed: slug must be unique',
            );
        });
    });

    describe('findAll', () => {
        it('should return all permissions successfully', async () => {
            const permissions = [mockPermission, { ...mockPermission, _id: '507f1f77bcf86cd799439012' }];
            mockPermissionModel.find.mockResolvedValue(permissions);

            const result = await service.findAll();

            expect(mockPermissionModel.find).toHaveBeenCalled();
            expect(result).toEqual(permissions);
        });

        it('should return empty array when no permissions exist', async () => {
            mockPermissionModel.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(mockPermissionModel.find).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it('should throw InternalServerErrorException when find fails', async () => {
            const error = new Error('Database connection failed');
            mockPermissionModel.find.mockRejectedValue(error);

            await expect(service.findAll()).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.findAll()).rejects.toThrow(
                'An error occurred while fetching permissions: Database connection failed',
            );
        });

        it('should handle query errors during findAll', async () => {
            const error = new Error('Invalid query parameters');
            mockPermissionModel.find.mockRejectedValue(error);

            await expect(service.findAll()).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.findAll()).rejects.toThrow(
                'An error occurred while fetching permissions: Invalid query parameters',
            );
        });
    });

    describe('findOne', () => {
        const permissionId = '507f1f77bcf86cd799439011';

        it('should return a permission by id successfully', async () => {
            mockPermissionModel.findById.mockResolvedValue(mockPermission);

            const result = await service.findOne(permissionId);

            expect(mockPermissionModel.findById).toHaveBeenCalledWith(permissionId);
            expect(result).toEqual(mockPermission);
        });

        it('should throw NotFoundException when permission not found', async () => {
            mockPermissionModel.findById.mockResolvedValue(null);

            await expect(service.findOne(permissionId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.findOne(permissionId)).rejects.toThrow(
                'Permission with ID 507f1f77bcf86cd799439011 not found',
            );
        });

        it('should throw InternalServerErrorException when findById fails', async () => {
            const error = new Error('Database connection failed');
            mockPermissionModel.findById.mockRejectedValue(error);

            await expect(service.findOne(permissionId)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.findOne(permissionId)).rejects.toThrow(
                'An error occurred while fetching the permission: Database connection failed',
            );
        });

        it('should handle invalid ObjectId format', async () => {
            const error = new Error('Cast to ObjectId failed');
            mockPermissionModel.findById.mockRejectedValue(error);

            await expect(service.findOne('invalid-id')).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.findOne('invalid-id')).rejects.toThrow(
                'An error occurred while fetching the permission: Cast to ObjectId failed',
            );
        });

        it('should preserve NotFoundException when thrown by service', async () => {
            const notFoundError = new NotFoundException('Permission not found');
            mockPermissionModel.findById.mockRejectedValue(notFoundError);

            await expect(service.findOne(permissionId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.findOne(permissionId)).rejects.toThrow(
                'Permission not found',
            );
        });
    });

    describe('update', () => {
        const permissionId = '507f1f77bcf86cd799439011';
        const updatePermissionDto: UpdatePermissionDto = {
            name: 'Updated Permission Name',
            description: 'Updated description',
        };

        it('should update a permission successfully', async () => {
            const updatedPermission = { ...mockPermission, ...updatePermissionDto };
            mockPermissionModel.findByIdAndUpdate(permissionId, updatePermissionDto, { new: true }).exec.mockResolvedValue(updatedPermission);

            const result = await service.update(permissionId, updatePermissionDto);

            expect(mockPermissionModel.findByIdAndUpdate).toHaveBeenCalledWith(
                permissionId,
                updatePermissionDto,
                { new: true },
            );
            expect(result).toEqual(updatedPermission);
        });

        it('should throw NotFoundException when permission not found during update', async () => {
            mockPermissionModel.findByIdAndUpdate(permissionId, updatePermissionDto, { new: true }).exec.mockResolvedValue(null);

            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                'Permission with ID 507f1f77bcf86cd799439011 not found',
            );
        });

        it('should throw InternalServerErrorException when update fails', async () => {
            const error = new Error('Database connection failed');
            mockPermissionModel.findByIdAndUpdate(permissionId, updatePermissionDto, { new: true }).exec.mockRejectedValue(error);

            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                'An error occurred while updating the permission: Database connection failed',
            );
        });

        it('should handle validation errors during update', async () => {
            const error = new Error('Validation failed: slug must be unique');
            mockPermissionModel.findByIdAndUpdate(permissionId, updatePermissionDto, { new: true }).exec.mockRejectedValue(error);

            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                'An error occurred while updating the permission: Validation failed: slug must be unique',
            );
        });

        it('should preserve NotFoundException when thrown by service', async () => {
            const notFoundError = new NotFoundException('Permission not found');
            mockPermissionModel.findByIdAndUpdate(permissionId, updatePermissionDto, { new: true }).exec.mockRejectedValue(notFoundError);

            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.update(permissionId, updatePermissionDto)).rejects.toThrow(
                'Permission not found',
            );
        });

        it('should handle partial updates correctly', async () => {
            const partialUpdate = { name: 'Only Name Updated' };
            const updatedPermission = { ...mockPermission, name: 'Only Name Updated' };
            mockPermissionModel.findByIdAndUpdate(permissionId, partialUpdate, { new: true }).exec.mockResolvedValue(updatedPermission);

            const result = await service.update(permissionId, partialUpdate);

            expect(mockPermissionModel.findByIdAndUpdate).toHaveBeenCalledWith(
                permissionId,
                partialUpdate,
                { new: true },
            );
            expect(result).toEqual(updatedPermission);
        });
    });

    describe('remove', () => {
        const permissionId = '507f1f77bcf86cd799439011';

        it('should delete a permission successfully', async () => {
            mockPermissionModel.findByIdAndDelete(permissionId).exec.mockResolvedValue(mockPermission);

            const result = await service.remove(permissionId);

            expect(mockPermissionModel.findByIdAndDelete).toHaveBeenCalledWith(permissionId);
            expect(result).toEqual(mockPermission);
        });

        it('should throw NotFoundException when permission not found during deletion', async () => {
            mockPermissionModel.findByIdAndDelete(permissionId).exec.mockResolvedValue(null);

            await expect(service.remove(permissionId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.remove(permissionId)).rejects.toThrow(
                'Permission with ID 507f1f77bcf86cd799439011 not found',
            );
        });

        it('should throw InternalServerErrorException when deletion fails', async () => {
            const error = new Error('Database connection failed');
            mockPermissionModel.findByIdAndDelete(permissionId).exec.mockRejectedValue(error);

            await expect(service.remove(permissionId)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.remove(permissionId)).rejects.toThrow(
                'An error occurred while deleting the permission: Database connection failed',
            );
        });

        it('should handle constraint violation errors during deletion', async () => {
            const error = new Error('Cannot delete permission: referenced by roles');
            mockPermissionModel.findByIdAndDelete(permissionId).exec.mockRejectedValue(error);

            await expect(service.remove(permissionId)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.remove(permissionId)).rejects.toThrow(
                'An error occurred while deleting the permission: Cannot delete permission: referenced by roles',
            );
        });

        it('should preserve NotFoundException when thrown by service', async () => {
            const notFoundError = new NotFoundException('Permission not found');
            mockPermissionModel.findByIdAndDelete(permissionId).exec.mockRejectedValue(notFoundError);

            await expect(service.remove(permissionId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.remove(permissionId)).rejects.toThrow(
                'Permission not found',
            );
        });
    });

    describe('getUserPermissions', () => {
        const userId = '507f1f77bcf86cd799439011';

        it('should return user permissions successfully', async () => {
            const userWithPermissions = {
                _id: userId,
                permissions: [mockPermission],
                roles: ['admin'],
            };
            mockUsersService.findOneByUserId.mockResolvedValue(userWithPermissions);

            const result = await service.getUserPermissions(userId);

            expect(mockUsersService.findOneByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(userWithPermissions);
        });

        it('should return empty array when user not found', async () => {
            mockUsersService.findOneByUserId.mockResolvedValue(null);

            const result = await service.getUserPermissions(userId);

            expect(mockUsersService.findOneByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual([]);
        });

        it('should return empty array when NotFoundException is thrown', async () => {
            const notFoundError = new NotFoundException('User not found');
            mockUsersService.findOneByUserId.mockRejectedValue(notFoundError);

            const result = await service.getUserPermissions(userId);

            expect(mockUsersService.findOneByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual([]);
        });

        it('should throw InternalServerErrorException when other errors occur', async () => {
            const error = new Error('Database connection failed');
            mockUsersService.findOneByUserId.mockRejectedValue(error);

            await expect(service.getUserPermissions(userId)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.getUserPermissions(userId)).rejects.toThrow(
                'An error occurred while fetching user permissions: Database connection failed',
            );
        });

        it('should handle user with no permissions', async () => {
            const userWithoutPermissions = {
                _id: userId,
                permissions: [],
                roles: ['user'],
            };
            mockUsersService.findOneByUserId.mockResolvedValue(userWithoutPermissions);

            const result = await service.getUserPermissions(userId);

            expect(mockUsersService.findOneByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(userWithoutPermissions);
        });

        it('should handle user service errors gracefully', async () => {
            const serviceError = new Error('User service unavailable');
            mockUsersService.findOneByUserId.mockRejectedValue(serviceError);

            await expect(service.getUserPermissions(userId)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.getUserPermissions(userId)).rejects.toThrow(
                'An error occurred while fetching user permissions: User service unavailable',
            );
        });
    });

    describe('error logging', () => {
        it('should log errors appropriately for create method', async () => {
            const error = new Error('Test error');
            const createDto: CreatePermissionDto = {
                name: 'Test Permission',
                description: 'Test Description',
                slug: 'test:permission',
                module: 'user',
                action: 'test',
            };

            mockPermissionDocument.save.mockRejectedValue(error);

            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to create permission: Test error',
                error.stack,
            );
        });

        it('should log errors appropriately for findAll method', async () => {
            const error = new Error('Test error');
            mockPermissionModel.find.mockRejectedValue(error);

            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to fetch permissions: Test error',
                error.stack,
            );
        });

        it('should log errors appropriately for findOne method', async () => {
            const error = new Error('Test error');
            mockPermissionModel.findById.mockRejectedValue(error);

            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.findOne('test-id')).rejects.toThrow(InternalServerErrorException);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to find permission with id test-id: Test error',
                error.stack,
            );
        });

        it('should log errors appropriately for update method', async () => {
            const error = new Error('Test error');
            const updateDto: UpdatePermissionDto = { name: 'Updated Name' };
            mockPermissionModel.findByIdAndUpdate('test-id', updateDto, { new: true }).exec.mockRejectedValue(error);

            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.update('test-id', updateDto)).rejects.toThrow(InternalServerErrorException);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to update permission with id test-id: Test error',
                error.stack,
            );
        });

        it('should log errors appropriately for remove method', async () => {
            const error = new Error('Test error');
            mockPermissionModel.findByIdAndDelete('test-id').exec.mockRejectedValue(error);

            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.remove('test-id')).rejects.toThrow(InternalServerErrorException);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to delete permission with id test-id: Test error',
                error.stack,
            );
        });

        it('should log warnings appropriately for getUserPermissions method', async () => {
            mockUsersService.findOneByUserId.mockResolvedValue(null);

            const loggerSpy = jest.spyOn(service['logger'], 'warn');

            await service.getUserPermissions('test-user-id');

            expect(loggerSpy).toHaveBeenCalledWith('User not found: test-user-id');
        });

        it('should log errors appropriately for getUserPermissions method', async () => {
            const error = new Error('Test error');
            mockUsersService.findOneByUserId.mockRejectedValue(error);

            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.getUserPermissions('test-user-id')).rejects.toThrow(InternalServerErrorException);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to get user permissions for user test-user-id: Test error',
                error.stack,
            );
        });
    });
}); 