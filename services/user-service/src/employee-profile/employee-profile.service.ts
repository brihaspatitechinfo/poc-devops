import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeProfile, EmployeeProfileDocument } from './entities/employee-profile.entity';

@Injectable()
export class EmployeeProfileService {
    private readonly logger = new Logger(EmployeeProfileService.name);

    constructor(
        @InjectModel(EmployeeProfile.name)
        private employeeProfileModel: Model<EmployeeProfileDocument>,
    ) { }

    async create(createEmployeeProfileDto: CreateEmployeeProfileDto): Promise<EmployeeProfileDocument> {
        try {
            // const { userId } = createEmployeeProfileDto;
            // const existingProfile = await this.employeeProfileModel.findOne({ userId }).lean();
            // if(existingProfile) {
            //     throw new ConflictException(`Employee profile with user ID '${userId}' already exists`);
            // }
            const createdProfile = new this.employeeProfileModel(createEmployeeProfileDto);
            return await createdProfile.save();
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            this.logger.error(
                `Failed to create employee profile: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while creating the employee profile: ${error.message}`,
            );
        }
    }

    async findAll(page: number, limit: number, active?: boolean): Promise<{ profiles: EmployeeProfileDocument[], total: number, page: number, limit: number }> {
        try {
            const skip = (page - 1) * limit;
            const query = active ? { pageActiveStatus: active } : {};
            const [profiles, total] = await Promise.all([
                this.employeeProfileModel.find(query).skip(skip).limit(limit).exec(),
                this.employeeProfileModel.countDocuments(query).exec()
            ]);
            return { profiles, total, page, limit };
        } catch (error) {
            this.logger.error(
                `Failed to fetch employee profiles: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while fetching employee profiles: ${error.message}`,
            );
        }
    }

    async findOne(id: string): Promise<EmployeeProfileDocument> {
        try {
            const profile = await this.employeeProfileModel.findById(id).exec();
            if (!profile) {
                throw new NotFoundException(`Employee profile with ID ${id} not found`);
            }
            return profile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to find employee profile with id ${id}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while fetching the employee profile: ${error.message}`,
            );
        }
    }

    async findByUserId(userId: number): Promise<EmployeeProfileDocument> {
        try {
            const userIdObjectId = new Types.ObjectId(userId);
            const profile = await this.employeeProfileModel.findOne({ userId: userIdObjectId }).exec();
            if (!profile) {
                throw new NotFoundException(`Employee profile with user ID ${userId} not found`);
            }
            return profile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to find employee profile with user ID ${userId}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while fetching the employee profile: ${error.message}`,
            );
        }
    }

    async findByOrgSlug(orgSlug: string): Promise<EmployeeProfileDocument> {
        try {
            const profile = await this.employeeProfileModel.findOne({ orgSlug }).exec();
            if (!profile) {
                throw new NotFoundException(`Employee profile with organization slug ${orgSlug} not found`);
            }
            return profile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to find employee profile with org slug ${orgSlug}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while fetching the employee profile: ${error.message}`,
            );
        }
    }

    async update(id: string, updateEmployeeProfileDto: UpdateEmployeeProfileDto): Promise<EmployeeProfileDocument> {
        try {
            const updatedProfile = await this.employeeProfileModel.findByIdAndUpdate(id,updateEmployeeProfileDto,{ new: true }).exec();
            if (!updatedProfile) {
                throw new NotFoundException(`Employee profile with ID ${id} not found`);
            }
            return updatedProfile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to update employee profile with id ${id}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while updating the employee profile: ${error.message}`,
            );
        }
    }

    async remove(id: string): Promise<EmployeeProfileDocument> {
        try {
            const deletedProfile = await this.employeeProfileModel.findByIdAndDelete(id).exec();
            if (!deletedProfile) {
                throw new NotFoundException(`Employee profile with ID ${id} not found`);
            }
            return deletedProfile;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to delete employee profile with id ${id}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException(
                `An error occurred while deleting the employee profile: ${error.message}`,
            );
        }
    }
} 