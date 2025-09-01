import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { UserSetting, UserSettingDocument } from './entities/user-setting.entity';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
    let service: UserSettingsService;
    let model: Model<UserSettingDocument>;

    const mockUserSetting = {
        _id: '507f1f77bcf86cd799439011',
        userId: new Types.ObjectId('507f1f77bcf86cd799439012'),
        ipaddress: '192.168.1.1',
        countryId: 1,
        currencyId: 1,
        timezoneId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        // Create a comprehensive mock model with all required methods
        const mockModelConstructor = jest.fn().mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockUserSetting),
        }));

        // Add static methods to the constructor
        (mockModelConstructor as any).find = jest.fn();
        (mockModelConstructor as any).findById = jest.fn();
        (mockModelConstructor as any).findByIdAndUpdate = jest.fn();
        (mockModelConstructor as any).findByIdAndDelete = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserSettingsService,
                {
                    provide: getModelToken(UserSetting.name),
                    useValue: mockModelConstructor,
                },
            ],
        }).compile();

        service = module.get<UserSettingsService>(UserSettingsService);
        model = module.get<Model<UserSettingDocument>>(getModelToken(UserSetting.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user setting', async () => {
            const createDto: CreateUserSettingDto = {
                userId: '507f1f77bcf86cd799439012',
                ipaddress: '192.168.1.1',
                countryId: 1,
                currencyId: 1,
                timezoneId: 1,
            };

            const result = await service.create(createDto);

            expect(model).toHaveBeenCalledWith({
                ...createDto,
                userId: new Types.ObjectId(createDto.userId),
            });
            expect(result).toEqual(mockUserSetting);
        });
    });

    describe('findAll', () => {
        it('should return all active user settings', async () => {
            const mockFind = {
                exec: jest.fn().mockResolvedValue([mockUserSetting]),
            };
            (model as any).find.mockReturnValue(mockFind);

            const result = await service.findAll();

            expect(model.find).toHaveBeenCalledWith({ isActive: true });
            expect(result).toEqual([mockUserSetting]);
        });
    });

    describe('findOne', () => {
        it('should return a user setting by id', async () => {
            const id = '507f1f77bcf86cd799439011';
            const mockFindById = {
                exec: jest.fn().mockResolvedValue(mockUserSetting),
            };
            (model as any).findById.mockReturnValue(mockFindById);

            const result = await service.findOne(id);

            expect(model.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockUserSetting);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            const mockFindById = {
                exec: jest.fn().mockResolvedValue(null),
            };
            (model as any).findById.mockReturnValue(mockFindById);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByUserId', () => {
        it('should return user settings by user id', async () => {
            const userId = '507f1f77bcf86cd799439012';
            const mockFind = {
                exec: jest.fn().mockResolvedValue([mockUserSetting]),
            };
            (model as any).find.mockReturnValue(mockFind);

            const result = await service.findByUserId(userId);

            expect(model.find).toHaveBeenCalledWith({
                userId: new Types.ObjectId(userId),
                isActive: true,
            });
            expect(result).toEqual([mockUserSetting]);
        });
    });

    describe('update', () => {
        it('should update a user setting', async () => {
            const id = '507f1f77bcf86cd799439011';
            const updateDto: UpdateUserSettingDto = {
                ipaddress: '192.168.1.2',
            };

            const updatedUserSetting = { ...mockUserSetting, ...updateDto };
            const mockFindByIdAndUpdate = {
                exec: jest.fn().mockResolvedValue(updatedUserSetting),
            };
            (model as any).findByIdAndUpdate.mockReturnValue(mockFindByIdAndUpdate);

            const result = await service.update(id, updateDto);

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, updateDto, { new: true });
            expect(result).toEqual(updatedUserSetting);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            const updateDto: UpdateUserSettingDto = { ipaddress: '192.168.1.2' };
            const mockFindByIdAndUpdate = {
                exec: jest.fn().mockResolvedValue(null),
            };
            (model as any).findByIdAndUpdate.mockReturnValue(mockFindByIdAndUpdate);

            await expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should soft delete a user setting', async () => {
            const id = '507f1f77bcf86cd799439011';
            const deletedUserSetting = { ...mockUserSetting, isActive: false };
            const mockFindByIdAndUpdate = {
                exec: jest.fn().mockResolvedValue(deletedUserSetting),
            };
            (model as any).findByIdAndUpdate.mockReturnValue(mockFindByIdAndUpdate);

            const result = await service.remove(id);

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
                id,
                { isActive: false, deletedAt: expect.any(Date) },
                { new: true }
            );
            expect(result).toEqual(deletedUserSetting);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            const mockFindByIdAndUpdate = {
                exec: jest.fn().mockResolvedValue(null),
            };
            (model as any).findByIdAndUpdate.mockReturnValue(mockFindByIdAndUpdate);

            await expect(service.remove(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('hardDelete', () => {
        it('should hard delete a user setting', async () => {
            const id = '507f1f77bcf86cd799439011';
            const mockFindByIdAndDelete = {
                exec: jest.fn().mockResolvedValue(mockUserSetting),
            };
            (model as any).findByIdAndDelete.mockReturnValue(mockFindByIdAndDelete);

            await service.hardDelete(id);

            expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            const mockFindByIdAndDelete = {
                exec: jest.fn().mockResolvedValue(null),
            };
            (model as any).findByIdAndDelete.mockReturnValue(mockFindByIdAndDelete);

            await expect(service.hardDelete(id)).rejects.toThrow(NotFoundException);
        });
    });
}); 