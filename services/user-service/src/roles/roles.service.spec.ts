import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleDocument } from './entities/role.entity';
import { RolesService } from './roles.service';

describe('RolesService', () => {
    let service: RolesService;
    let roleModel: any;

    const mockRole: Partial<RoleDocument> = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Admin',
        slug: 'role:admin',
        description: 'Administrator role with full access',
        rolePermissions: ['user:create', 'user:read', 'user:update', 'user:delete'],
        isActive: true,
        createdBy: new Types.ObjectId('507f1f77bcf86cd799439012'),
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z')
    };

    const mockCreateRoleDto: CreateRoleDto = {
        name: 'Test Role',
        slug: 'role:test',
        description: 'Test role description',
        rolePermissions: ['user:read'],
        isActive: true,
        createdBy: new Types.ObjectId('507f1f77bcf86cd799439012')
    };

    const mockUpdateRoleDto = {
        name: 'Updated Role',
        slug: 'role:updated',
        description: 'Updated role description',
        rolePermissions: ['user:read', 'user:write']
    };

    beforeEach(async () => {
        // Create a fresh mock for each test
        const mockRoleModel = jest.fn().mockImplementation(() => ({
            save: jest.fn()
        })) as any;

        // Add static methods to the mock function
        mockRoleModel.find = jest.fn();
        mockRoleModel.findOne = jest.fn();
        mockRoleModel.findById = jest.fn();
        mockRoleModel.findByIdAndUpdate = jest.fn();
        mockRoleModel.findByIdAndDelete = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesService,
                {
                    provide: getModelToken(Role.name),
                    useValue: mockRoleModel,
                },
            ],
        }).compile();

        service = module.get<RolesService>(RolesService);
        roleModel = module.get(getModelToken(Role.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new role successfully when no duplicate exists', async () => {
            // Explicitly set findOne to always return null for this test
            roleModel.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));

            // Mock the constructor behavior
            const mockNewRole = {
                ...mockRole,
                name: 'Test Role',
                slug: 'role:test',
                save: jest.fn().mockResolvedValue({
                    ...mockRole,
                    name: 'Test Role',
                    slug: 'role:test'
                })
            };

            // Set up the constructor mock properly
            roleModel.mockImplementation(() => mockNewRole);

            const result = await service.create(mockCreateRoleDto);

            expect(result).toEqual({
                ...mockRole,
                name: 'Test Role',
                slug: 'role:test'
            });
            expect(roleModel.findOne).toHaveBeenCalledWith({
                $or: [{ name: mockCreateRoleDto.name }, { slug: mockCreateRoleDto.slug }],
            });
            expect(mockNewRole.save).toHaveBeenCalled();
        });

        it('should throw BadRequestException when role with same name already exists', async () => {
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockRole, name: mockCreateRoleDto.name, slug: 'different:slug' }),
            });

            await expect(service.create(mockCreateRoleDto)).rejects.toThrow(
                new BadRequestException(`Role with name '${mockCreateRoleDto.name}' or slug '${mockCreateRoleDto.slug}' already exists`)
            );
            expect(roleModel.findOne).toHaveBeenCalledWith({
                $or: [{ name: mockCreateRoleDto.name }, { slug: mockCreateRoleDto.slug }],
            });
        });

        it('should throw BadRequestException when role with same slug already exists', async () => {
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockRole, name: 'Different Name', slug: mockCreateRoleDto.slug }),
            });

            await expect(service.create(mockCreateRoleDto)).rejects.toThrow(
                new BadRequestException(`Role with name '${mockCreateRoleDto.name}' or slug '${mockCreateRoleDto.slug}' already exists`)
            );
        });

        it('should throw InternalServerErrorException when database error occurs during duplicate check', async () => {
            // Explicitly set findOne to throw for this call
            roleModel.findOne.mockImplementationOnce(() => ({
                exec: jest.fn().mockRejectedValue(new Error('Database connection failed')),
            }));

            await expect(service.create(mockCreateRoleDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return all roles sorted by level and name', async () => {
            const mockRoles = [mockRole, { ...mockRole, name: 'User', slug: 'role:user' }];

            roleModel.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockRoles),
                }),
            });

            const result = await service.findAll();

            expect(result).toEqual(mockRoles);
            expect(roleModel.find).toHaveBeenCalled();
            expect(roleModel.find().sort).toHaveBeenCalledWith({ level: 1, name: 1 });
        });

        it('should throw InternalServerErrorException when database error occurs during fetch', async () => {
            roleModel.find.mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    exec: jest.fn().mockRejectedValue(new Error('Database connection failed')),
                }),
            });

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findById', () => {
        it('should return role by id successfully when role exists', async () => {
            roleModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRole),
            });

            const result = await service.findById('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockRole);
            expect(roleModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should throw NotFoundException when role with given id does not exist', async () => {
            roleModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
            // Ensure findOne returns null so no duplicate error
            roleModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

            await expect(service.findById('507f1f77bcf86cd799439011')).rejects.toThrow(
                new NotFoundException('Role with id 507f1f77bcf86cd799439011 not found')
            );
        });

        it('should throw InternalServerErrorException when database error occurs during find by id', async () => {
            roleModel.findById.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database connection failed')),
            });
            // Ensure findOne returns null so no duplicate error
            roleModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

            await expect(service.findById('507f1f77bcf86cd799439011')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findBySlug', () => {
        it('should return role by slug successfully when role exists', async () => {
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRole),
            });

            const result = await service.findBySlug('role:admin');

            expect(result).toEqual(mockRole);
            expect(roleModel.findOne).toHaveBeenCalledWith({ slug: 'role:admin' });
        });

        it('should throw NotFoundException when role with given slug does not exist', async () => {
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findBySlug('nonexistent:slug')).rejects.toThrow(
                new NotFoundException('Role with slug nonexistent:slug not found')
            );
        });

        it('should throw InternalServerErrorException when database error occurs during find by slug', async () => {
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database connection failed')),
            });

            await expect(service.findBySlug('role:admin')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update role successfully when no conflicts exist', async () => {
            // Explicitly set findOne to always return null for this test
            roleModel.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));
            const updatedRole = { ...mockRole, ...mockUpdateRoleDto };
            roleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedRole),
            });

            const result = await service.update('507f1f77bcf86cd799439011', mockUpdateRoleDto);

            expect(result).toEqual(updatedRole);
            expect(roleModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '507f1f77bcf86cd799439011',
                mockUpdateRoleDto,
                { new: true }
            );
        });

        it('should throw BadRequestException when updating with existing name', async () => {
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockRole, name: mockUpdateRoleDto.name, _id: new Types.ObjectId('507f1f77bcf86cd799439013') }),
            });

            await expect(service.update('507f1f77bcf86cd799439011', mockUpdateRoleDto)).rejects.toThrow(
                new BadRequestException(`Role with name '${mockUpdateRoleDto.name}' or slug '${mockUpdateRoleDto.slug}' already exists`)
            );
        });

        it('should throw BadRequestException when updating with existing slug', async () => {
            const updateWithSlug = { ...mockUpdateRoleDto, slug: 'role:existing' };
            roleModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue({ ...mockRole, slug: 'role:existing', _id: new Types.ObjectId('507f1f77bcf86cd799439013') }),
            });

            await expect(service.update('507f1f77bcf86cd799439011', updateWithSlug)).rejects.toThrow(
                new BadRequestException(`Role with name '${updateWithSlug.name}' or slug '${updateWithSlug.slug}' already exists`)
            );
        });

        it('should convert string permission IDs to ObjectIds when updating', async () => {
            // Explicitly set findOne to always return null for this test
            roleModel.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));
            const updateWithPermissionIds = {
                ...mockUpdateRoleDto,
                rolePermissions: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014']
            };
            const updatedRole = { ...mockRole, ...updateWithPermissionIds };
            roleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedRole),
            });

            await service.update('507f1f77bcf86cd799439011', updateWithPermissionIds);

            expect(roleModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '507f1f77bcf86cd799439011',
                expect.objectContaining({
                    rolePermissions: [
                        new Types.ObjectId('507f1f77bcf86cd799439013'),
                        new Types.ObjectId('507f1f77bcf86cd799439014')
                    ]
                }),
                { new: true }
            );
        });

        it('should throw NotFoundException when role to update does not exist', async () => {
            // Explicitly set findOne to always return null for this test
            roleModel.findOne.mockImplementation(() => ({
                exec: jest.fn().mockResolvedValue(null),
            }));
            roleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.update('507f1f77bcf86cd799439011', mockUpdateRoleDto)).rejects.toThrow(
                new NotFoundException('Role with id 507f1f77bcf86cd799439011 not found')
            );
        });

        it('should throw InternalServerErrorException when database error occurs during update', async () => {
            // Explicitly set findOne to throw for this call
            roleModel.findOne.mockImplementationOnce(() => ({
                exec: jest.fn().mockRejectedValue(new Error('Database connection failed')),
            }));
            roleModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.update('507f1f77bcf86cd799439011', mockUpdateRoleDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('delete', () => {
        it('should delete role successfully when role exists', async () => {
            roleModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRole),
            });

            const result = await service.delete('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockRole);
            expect(roleModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should throw NotFoundException when role to delete does not exist', async () => {
            roleModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.delete('507f1f77bcf86cd799439011')).rejects.toThrow(
                new NotFoundException('Role with id 507f1f77bcf86cd799439011 not found')
            );
        });

        it('should throw InternalServerErrorException when database error occurs during delete', async () => {
            roleModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database connection failed')),
            });

            await expect(service.delete('507f1f77bcf86cd799439011')).rejects.toThrow(InternalServerErrorException);
        });
    });
}); 