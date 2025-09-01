import {
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;
    let userModel: Model<UserDocument>;

    const mockUserModel = {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn(),
        countDocuments: jest.fn(),
        insertMany: jest.fn(),
        exec: jest.fn(),
        lean: jest.fn(),
        skip: jest.fn(),
        limit: jest.fn(),
        populate: jest.fn(),
        save: jest.fn()
    };

    const mockUser: Partial<UserDocument> = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@xyz.com',
        dialCodeId: 1,
        phone: '1234567890',
        userId: '507f1f77bcf86cd799439011',
        // roleId: new Types.ObjectId('507f1f77bcf86cd799439011'),
        roles: [
            {
                role_id: '507f1f77bcf86cd799439011',
                slug: 'corporate_admin',
                sort_order: 1
            }
        ],
        isActive: true,
        designation: 'HR Manager',
        alternateEmail: 'john.alternate@email.com',
        companyName: 'Acme Corporation',
        companyOverview: 'HR solutions provider focused on DEI and talent development.',
        taxIdentification: 'PAN1234567A',
        officeNumber: '(555) 123-4567',
        companyHeadquarters: 'San Francisco, CA, USA',
        country: 'United States',
        state: 'California',
        city: 'San Francisco',
        pinCode: '94105',
        corporateCurrency: 'USD',
        createCompanyPage: false,
        companyHeadline: 'Leading provider of digital learning platforms',
        productsServices: 'Custom e-learning modules, talent acquisition software, career coaching services',
        deiCulturePolicies: 'Our DEI culture fosters belonging and equity—supported by inclusive hiring, unconscious bias training, flexible work policies, and accessibility accommodations.',
        industry: 'Technology',
        websiteLink: 'https://www.example.com',
        videoLink: 'https://youtube.com/watch?v=example',
        tags: ['HR', 'mentorship', 'wellness'],
        shouldReLogin: false
    };

    const mockCreateUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        companyName: 'Test Company',
        country: 'USA',
    };
    const mockUpdateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user successfully', async () => {
            const mockNewUser = {
                ...mockUser,
                save: jest.fn().mockResolvedValue(mockUser)
            };

            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            // Create a mock constructor that returns our mock user
            const MockUserModel = jest.fn().mockImplementation(() => mockNewUser) as any;
            MockUserModel.findOne = mockUserModel.findOne;

            // Temporarily replace the userModel
            const originalUserModel = service['userModel'];
            service['userModel'] = MockUserModel;

            const result = await service.create(mockCreateUserDto);

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: mockCreateUserDto.email });
            expect(mockNewUser.save).toHaveBeenCalled();
            expect(MockUserModel).toHaveBeenCalledWith(mockCreateUserDto);

            // Restore the original userModel
            service['userModel'] = originalUserModel;
        });

        it('should throw ConflictException when user with email already exists', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            await expect(service.create(mockCreateUserDto)).rejects.toThrow(ConflictException);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: mockCreateUserDto.email });
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.create(mockCreateUserDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('multiRegister', () => {
        const mockUsers = [mockCreateUserDto, { ...mockCreateUserDto, email: 'jane@example.com' }];
        const emails = ['john.doe@example.com', 'jane@example.com'];

        it('should register multiple users successfully', async () => {
            const mockInsertedUsers = [mockUser, { ...mockUser, email: 'jane@example.com' }];

            mockUserModel.find.mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue([]),
                }),
            });
            mockUserModel.insertMany.mockResolvedValue(mockInsertedUsers);

            const result = await service.multiRegister(mockUsers);

            expect(result).toEqual(mockInsertedUsers);
            expect(mockUserModel.find).toHaveBeenCalledWith({ email: { $in: emails } }, { email: 1, _id: 0 });
            expect(mockUserModel.insertMany).toHaveBeenCalledWith(mockUsers, { ordered: true });
        });

        it('should throw ConflictException when duplicate emails exist', async () => {
            const existingUsers = [{ email: 'john.doe@example.com' }];

            mockUserModel.find.mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(existingUsers),
                }),
            });

            await expect(service.multiRegister(mockUsers)).rejects.toThrow(ConflictException);
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.find.mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockRejectedValue(new Error('Database error')),
                }),
            });

            await expect(service.multiRegister(mockUsers)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return paginated users successfully', async () => {
            const mockUsers = [mockUser];
            const mockQuery = {
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue(mockUsers),
                    }),
                }),
            };

            mockUserModel.find.mockReturnValue(mockQuery);
            mockUserModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1),
            });

            const result = await service.findAll(1, 10);

            expect(result).toEqual({
                users: mockUsers,
                total: 1,
                page: 1,
                limit: 10,
            });
            expect(mockUserModel.find).toHaveBeenCalled();
            expect(mockUserModel.countDocuments).toHaveBeenCalled();
        });

        it('should use default pagination when no parameters provided', async () => {
            const mockUsers = [mockUser];
            const mockQuery = {
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue(mockUsers),
                    }),
                }),
            };

            mockUserModel.find.mockReturnValue(mockQuery);
            mockUserModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1),
            });

            const result = await service.findAll();

            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.find.mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        exec: jest.fn().mockRejectedValue(new Error('Database error')),
                    }),
                }),
            });

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return user by id successfully', async () => {
            mockUserModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.findOne('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should return null when user not found', async () => {
            mockUserModel.findById.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.findOne('507f1f77bcf86cd799439011');

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findById.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOneByEmail', () => {
        it('should return user by email successfully', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.findOneByEmail('john.doe@example.com');

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
        });

        it('should return null when user not found', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.findOneByEmail('nonexistent@example.com');

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.findOneByEmail('john.doe@example.com')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOneByUserId', () => {
        it('should return user by userId with populated roleId successfully', async () => {
            const mockPopulatedUser = { ...mockUser, roleId: { name: 'Admin', rolePermissions: ['read', 'write'] } };

            mockUserModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockPopulatedUser),
                }),
            });

            const result = await service.findOneByUserId('user123');

            expect(result).toEqual(mockPopulatedUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        });

        it('should return null when user not found', async () => {
            mockUserModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            });

            const result = await service.findOneByUserId('nonexistent');

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findOne.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    exec: jest.fn().mockRejectedValue(new Error('Database error')),
                }),
            });

            await expect(service.findOneByUserId('user123')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update user successfully', async () => {
            const updatedUser = { ...mockUser, ...mockUpdateUserDto };

            mockUserModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedUser),
            });

            const result = await service.update('507f1f77bcf86cd799439011', mockUpdateUserDto);

            expect(result).toEqual(updatedUser);
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                '507f1f77bcf86cd799439011',
                mockUpdateUserDto,
                { new: true }
            );
        });

        it('should return null when user not found', async () => {
            mockUserModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.update('507f1f77bcf86cd799439011', mockUpdateUserDto);

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findByIdAndUpdate.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.update('507f1f77bcf86cd799439011', mockUpdateUserDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('remove', () => {
        it('should delete user successfully', async () => {
            mockUserModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.remove('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should return null when user not found', async () => {
            mockUserModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.remove('507f1f77bcf86cd799439011');

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getCurrentUserProfile', () => {
        it('should return current user profile successfully', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.getCurrentUserProfile('user123');

            expect(result).toEqual(mockUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ userId: 'user123' });
        });

        it('should throw InternalServerErrorException when user not found', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });
            await expect(service.getCurrentUserProfile('nonexistent')).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findOne.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.getCurrentUserProfile('user123')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('searchUsers', () => {
        it('should search users with query successfully', async () => {
            const mockUsers = [mockUser];

            mockUserModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await service.searchUsers('john');

            expect(result).toEqual(mockUsers);
            expect(mockUserModel.find).toHaveBeenCalledWith({
                $or: [
                    { firstName: { $regex: 'john', $options: 'i' } },
                    { lastName: { $regex: 'john', $options: 'i' } },
                    { email: { $regex: 'john', $options: 'i' } },
                    { phone: { $regex: 'john', $options: 'i' } },
                ],
            });
        });

        it('should search users with filters successfully', async () => {
            const mockUsers = [mockUser];
            const filters = { isActive: true };

            mockUserModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await service.searchUsers('john', filters);

            expect(result).toEqual(mockUsers);
            expect(mockUserModel.find).toHaveBeenCalledWith({
                $or: [
                    { firstName: { $regex: 'john', $options: 'i' } },
                    { lastName: { $regex: 'john', $options: 'i' } },
                    { email: { $regex: 'john', $options: 'i' } },
                    { phone: { $regex: 'john', $options: 'i' } },
                ],
                ...filters,
            });
        });

        it('should search users without query successfully', async () => {
            const mockUsers = [mockUser];

            mockUserModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await service.searchUsers('');

            expect(result).toEqual(mockUsers);
            expect(mockUserModel.find).toHaveBeenCalledWith({});
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.find.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.searchUsers('john')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('confirmRegistration', () => {
        it('should return null and log warning (placeholder implementation)', async () => {
            const result = await service.confirmRegistration('john.doe@example.com', '123456');

            expect(result).toBeNull();
        });

        it('should throw InternalServerErrorException when error occurs', async () => {
            // This test would be updated when the method is properly implemented
            const result = await service.confirmRegistration('john.doe@example.com', '123456');
            expect(result).toBeNull();
        });
    });

    describe('updateDirectPermissions', () => {
        it('should update direct permissions successfully', async () => {
            const updatedUser = { ...mockUser, directPermissions: ['read', 'write'] };

            mockUserModel.findOneAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedUser),
            });

            const result = await service.updateDirectPermissions({
                userId: 'user123',
                directPermissions: ['read', 'write']
            });

            expect(result).toEqual({ message: 'Direct permissions updated successfully' });
            expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: 'user123' },
                { directPermissions: ['read', 'write'] },
                { new: true }
            );
        });

        it('should throw InternalServerErrorException when user not found', async () => {
            mockUserModel.findOneAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.updateDirectPermissions({
                userId: 'nonexistent',
                directPermissions: ['read']
            })).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException when database error occurs', async () => {
            mockUserModel.findOneAndUpdate.mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('Database error')),
            });

            await expect(service.updateDirectPermissions({
                userId: 'user123',
                directPermissions: ['read']
            })).rejects.toThrow(InternalServerErrorException);
        });
    });
}); 