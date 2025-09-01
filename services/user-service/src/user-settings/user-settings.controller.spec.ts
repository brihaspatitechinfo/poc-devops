import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsController', () => {
    let controller: UserSettingsController;
    let service: UserSettingsService;

    const mockUserSettingsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByUserId: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        hardDelete: jest.fn(),
    };

    const mockUserSetting = {
        _id: '507f1f77bcf86cd799439011',
        userId: '507f1f77bcf86cd799439012',
        ipaddress: '192.168.1.1',
        countryId: 1,
        currencyId: 1,
        timezoneId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserSettingsController],
            providers: [
                {
                    provide: UserSettingsService,
                    useValue: mockUserSettingsService,
                },
            ],
        }).compile();

        controller = module.get<UserSettingsController>(UserSettingsController);
        service = module.get<UserSettingsService>(UserSettingsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
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

            mockUserSettingsService.create.mockResolvedValue(mockUserSetting);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockUserSetting);
        });
    });

    describe('findAll', () => {
        it('should return an array of user settings', async () => {
            const mockUserSettings = [mockUserSetting];
            mockUserSettingsService.findAll.mockResolvedValue(mockUserSettings);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockUserSettings);
        });
    });

    describe('findOne', () => {
        it('should return a user setting by id', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockUserSettingsService.findOne.mockResolvedValue(mockUserSetting);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockUserSetting);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockUserSettingsService.findOne.mockRejectedValue(new NotFoundException());

            await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findByUserId', () => {
        it('should return user settings by user id', async () => {
            const userId = '507f1f77bcf86cd799439012';
            const mockUserSettings = [mockUserSetting];
            mockUserSettingsService.findByUserId.mockResolvedValue(mockUserSettings);

            const result = await controller.findByUserId(userId);

            expect(service.findByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockUserSettings);
        });
    });

    describe('update', () => {
        it('should update a user setting', async () => {
            const id = '507f1f77bcf86cd799439011';
            const updateDto: UpdateUserSettingDto = {
                ipaddress: '192.168.1.2',
            };

            const updatedUserSetting = { ...mockUserSetting, ...updateDto };
            mockUserSettingsService.update.mockResolvedValue(updatedUserSetting);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(updatedUserSetting);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            const updateDto: UpdateUserSettingDto = { ipaddress: '192.168.1.2' };
            mockUserSettingsService.update.mockRejectedValue(new NotFoundException());

            await expect(controller.update(id, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should soft delete a user setting', async () => {
            const id = '507f1f77bcf86cd799439011';
            const deletedUserSetting = { ...mockUserSetting, isActive: false };
            mockUserSettingsService.remove.mockResolvedValue(deletedUserSetting);

            const result = await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
            expect(result).toEqual(deletedUserSetting);
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockUserSettingsService.remove.mockRejectedValue(new NotFoundException());

            await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('hardDelete', () => {
        it('should hard delete a user setting', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockUserSettingsService.hardDelete.mockResolvedValue(undefined);

            const result = await controller.hardDelete(id);

            expect(service.hardDelete).toHaveBeenCalledWith(id);
            expect(result).toBeUndefined();
        });

        it('should throw NotFoundException when user setting not found', async () => {
            const id = '507f1f77bcf86cd799439011';
            mockUserSettingsService.hardDelete.mockRejectedValue(new NotFoundException());

            await expect(controller.hardDelete(id)).rejects.toThrow(NotFoundException);
        });
    });
}); 