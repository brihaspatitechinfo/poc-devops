import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module, ModuleDocument } from './entities/module.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);
  
  constructor(
    @InjectModel(Module.name)
    private moduleModel: Model<ModuleDocument>,
    private configService: ConfigService,
  ) {}

  async create(createModuleDto: CreateModuleDto): Promise<ModuleDocument> {
    try {
      
      const { name , slug } = createModuleDto;
      const existingModule = await this.moduleModel.findOne({ $or: [{ name }, { slug }]}).lean();
      if (existingModule) {
        if (existingModule.name === name) {
          throw new ConflictException(`Module with name '${name}' already exists`);
        }
        if (existingModule.slug === slug) {
          throw new ConflictException(`Module with slug '${slug}' already exists`);
        }
      }
      const createdModule = new this.moduleModel(createModuleDto);
      return await createdModule.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create module: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while creating the module: ${error.message}`,
      );
    }
  }

  async findAll(page: number, limit: number, active: boolean): Promise<{ modules: ModuleDocument[], total: number, page: number, limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const query = active ? { isActive: true } : {};
      const [modules, total] = await Promise.all([this.moduleModel.find(query).skip(skip).limit(limit).exec() , this.moduleModel.countDocuments(query).exec()]);
      return { modules, total, page, limit };
    } catch (error) {
      this.logger.error(
        `Failed to fetch modules: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while fetching modules: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<ModuleDocument> {
    try {
      const module = await this.moduleModel.findById(id).exec();
      if (!module) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }
      return module;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to find module with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while fetching the module: ${error.message}`,
      );
    }
  }

  async update(id: string , updateModuleDto: UpdateModuleDto): Promise<ModuleDocument> {
    try {
      const existingModule = await this.moduleModel.findOne({ $or: [{ name: updateModuleDto.name }, { slug: updateModuleDto.slug }] }).lean();
      if (existingModule) {
          if (existingModule.slug === updateModuleDto.slug) {
            throw new ConflictException(`Module with slug '${updateModuleDto.slug}' already exists`);
          }
          if (existingModule.name === updateModuleDto.name) {
            throw new ConflictException(`Module with name '${updateModuleDto.name}' already exists`);
          }
      }
      const updatedModule = await this.moduleModel.findByIdAndUpdate(id, updateModuleDto, { new: true }).exec();
      if (!updatedModule) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }
      return updatedModule;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update module with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while updating the module: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<ModuleDocument> {
    try {
      const deletedModule = await this.moduleModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedModule) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }

      return deletedModule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete module with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while deleting the module: ${error.message}`,
      );
    }
  }

  async slug(slugs: string[]): Promise<ModuleDocument[]> {
    try {
      const modules = await this.moduleModel.find({ $or: [{ slug: { $in: slugs } } , { 'subModules.slug': { $in: slugs } }]}).lean();  
      return modules;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

} 