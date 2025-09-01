import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    private usersService: UsersService
  ) { }

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    try {
      const existingPermission = await this.permissionModel.findOne({ slug: createPermissionDto.slug });
      if (existingPermission) {
        throw new ConflictException('Permission with this slug already exists');
      }
      const createdPermission = new this.permissionModel(createPermissionDto);
      return await createdPermission.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create permission: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while creating the permission: ${error.message}`,
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10, isActive?: boolean): Promise<{ permissions: PermissionDocument[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {};
      if (isActive) {
        filter.isActive = isActive;
      }
      const [permissions, total] = await Promise.all([
        this.permissionModel.find(filter).skip(skip).limit(limit).exec(),
        this.permissionModel.countDocuments().exec()
      ]);
      return {
        permissions,
        total,
        page,
        limit
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch permissions: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while fetching permissions: ${error.message}`,
      );
    }
  }

  async findUserPermissions(query?: any): Promise<PermissionDocument[]> {
    try {//query
      const permissions = await this.permissionModel.find(query).exec();
      return permissions;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while fetching permissions by module id ${query}: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<PermissionDocument> {
    try {
      const permission = await this.permissionModel.findById(id);
      if (!permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }
      return permission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find permission with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while fetching the permission: ${error.message}`,
      );
    }
  }



  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDocument> {
    try {
      const updatedPermission = await this.permissionModel
        .findByIdAndUpdate(id, updatePermissionDto, { new: true })
        .exec();

      if (!updatedPermission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }
      return updatedPermission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update permission with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while updating the permission: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<PermissionDocument> {
    try {
      const deletedPermission = await this.permissionModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedPermission) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      return deletedPermission;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete permission with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while deleting the permission: ${error.message}`,
      );
    }
  }

  async getUserPermissions(userId: string): Promise<any> {
    try {
      const combinedPermissions = await this.usersService.findOneByUserId(userId);
      if (!combinedPermissions) {
        return [];
      }
      return combinedPermissions;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Entity not found for user ${userId}: ${error.message}`);
        return [];
      }
      this.logger.error(
        `Failed to get user permissions for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while fetching user permissions: ${error.message}`,
      );
    }
  }
}
