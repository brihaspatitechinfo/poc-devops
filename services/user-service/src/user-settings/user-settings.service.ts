import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { UserSetting, UserSettingDocument } from './entities/user-setting.entity';

@Injectable()
export class UserSettingsService {
    constructor(
        @InjectModel(UserSetting.name) private userSettingModel: Model<UserSettingDocument>,
    ) { }

    async create(createUserSettingDto: CreateUserSettingDto): Promise<UserSetting> {
        const createdUserSetting = new this.userSettingModel({
            ...createUserSettingDto,
            userId: new Types.ObjectId(createUserSettingDto.userId),
        });
        return createdUserSetting.save();
    }

    async findAll(): Promise<UserSetting[]> {
        return this.userSettingModel.find({ isActive: true }).exec();
    }

    async findOne(id: string): Promise<UserSetting> {
        const userSetting = await this.userSettingModel.findById(id).exec();
        if (!userSetting) {
            throw new NotFoundException(`User setting with ID ${id} not found`);
        }
        return userSetting;
    }

    async findByUserId(userId: string): Promise<UserSetting[]> {
        return this.userSettingModel.find({
            userId: new Types.ObjectId(userId),
            isActive: true
        }).exec();
    }

    async update(id: string, updateUserSettingDto: UpdateUserSettingDto): Promise<UserSetting> {
        const updatedUserSetting = await this.userSettingModel
            .findByIdAndUpdate(id, updateUserSettingDto, { new: true })
            .exec();

        if (!updatedUserSetting) {
            throw new NotFoundException(`User setting with ID ${id} not found`);
        }
        return updatedUserSetting;
    }

    async remove(id: string): Promise<UserSetting> {
        const deletedUserSetting = await this.userSettingModel
            .findByIdAndUpdate(id, { isActive: false, deletedAt: new Date() }, { new: true })
            .exec();

        if (!deletedUserSetting) {
            throw new NotFoundException(`User setting with ID ${id} not found`);
        }
        return deletedUserSetting;
    }

    async hardDelete(id: string): Promise<void> {
        const result = await this.userSettingModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User setting with ID ${id} not found`);
        }
    }
} 