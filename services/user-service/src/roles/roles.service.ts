import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleDocument } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) { }

  async create(data: CreateRoleDto): Promise<Role> {
    try {
      // Check if role with same name or slug already exists
      const existingRole = await this.roleModel.findOne({
        $or: [{ name: data.name }, { slug: data.slug }],
      });
      if (existingRole) {
        throw new ConflictException(
          `Role with name '${data.name}' or slug '${data.slug}' already exists`,
        );
      }
      const created = new this.roleModel(data);
      return await created.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create role: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(`An error occurred while creating the role ${error.message}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10, isActive?: boolean): Promise<{ roles: Role[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {};
      if (isActive) {
        filter.isActive = isActive;
      }
      const [roles, total] = await Promise.all([
        this.roleModel.find(filter).sort({ level: 1, name: 1 }).skip(skip).limit(limit).exec(),
        this.roleModel.countDocuments().exec()
      ]);
      return {
        roles,
        total,
        page,
        limit
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch roles: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching roles',
      );
    }
  }

  async find(query: any, select: any): Promise<any[]> {
    try {
      return this.roleModel.find(query).select(select).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while fetching roles: ${error.message}`
      );
    }
  }

  async findById(id: string): Promise<Role> {
    try {
      const role = await this.roleModel.findById(id).exec();
      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find role with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching the role',
      );
    }
  }

  async findBySlug(slug: string): Promise<Role> {
    try {
      const role = await this.roleModel.findOne({ slug }).exec();
      if (!role) {
        throw new NotFoundException(`Role with slug ${slug} not found`);
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find role with slug ${slug}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while fetching the role',
      );
    }
  }

  async update(id: string, updateData: any): Promise<Role> {
    try {
      // Check if updating name or slug would conflict with existing roles
      const updatedRole = await this.roleModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updatedRole) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return updatedRole;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Failed to update role with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while updating the role',
      );
    }
  }

  async delete(id: string): Promise<Role> {
    try {
      const deletedRole = await this.roleModel.findByIdAndDelete(id).exec();
      if (!deletedRole) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return deletedRole;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete role with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while deleting the role',
      );
    }
  }

} 