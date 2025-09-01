import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoService } from '../crypto/crypto.service';
import { ModulesService } from '../modules/modules.service';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly roleService: RolesService, @Inject(forwardRef(() => PermissionsService)) private readonly permissionService: PermissionsService, private readonly moduleService: ModulesService, private readonly cryptoService: CryptoService) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      // Encrypt sensitive user data
      createUserDto.firstName = await this.cryptoService.encrypt(createUserDto.firstName);
      createUserDto.lastName = await this.cryptoService.encrypt(createUserDto.lastName);
      createUserDto.email = await this.cryptoService.encrypt(createUserDto.email);
      createUserDto.phone = await this.cryptoService.encrypt(createUserDto.phone);
      const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
      if (existingUser) {
        throw new ConflictException('A user with this email address already exists. Please use a different email or try logging in.');
      }
      // if (createUserDto.roleId) {
      //   const roles = await this.roleService.findById(createUserDto.roleId);
      //   createUserDto.rolePermissions = roles.rolePermissions;
      // }
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create user: ${error}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while creating the user: ${error.message}`);
    }
  }

  async multiRegister(createUserDto: CreateUserDto[]): Promise<any> {
    try {

      const encryptedEmails: string[] = [];
      for (const user of createUserDto) {
        user.firstName = await this.cryptoService.encrypt(user.firstName);
        user.lastName = await this.cryptoService.encrypt(user.lastName);
        user.email = await this.cryptoService.encrypt(user.email);
        user.phone = await this.cryptoService.encrypt(user.phone);
        encryptedEmails.push(user.email);
      }
      const existingUsers = await this.userModel.find({ email: { $in: encryptedEmails } }, { email: 1, _id: 1 }).lean().exec();
      const existingEmails = existingUsers?.map(user => user.email) || [];
      const newUsers = createUserDto.filter(user => !existingEmails.includes(user.email));
      const savedUsers = await this.userModel.insertMany(newUsers, { ordered: true });
      return {
        savedUsers,
        "existingUsers": await Promise.all(existingUsers.map(async user => ({ _id: user._id, email: await this.cryptoService.decrypt(user.email) })))
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 11000 && error.keyPattern?.email) {
        const duplicateEmail = error.keyValue?.email || 'unknown';
        throw new ConflictException(`Email already exists: ${duplicateEmail}`);
      }
      this.logger.error(
        `Failed to register multiple users: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        'Something went wrong while registering users. Please try again later.'
      );
    }
  }



  async findAll(page: number = 1, limit: number = 10, isActive?: boolean): Promise<{ users: any[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {};
      if (isActive) {
        filter.isActive = isActive;
      }
      const [users, total] = await Promise.all([this.userModel.find(filter).skip(skip).limit(limit).lean().exec(), this.userModel.countDocuments().exec()]);
      const decryptedUsers = await Promise.all(users.map(async user => ({
        ...user,
        firstName: await this.cryptoService.decrypt(user.firstName),
        lastName: await this.cryptoService.decrypt(user.lastName),
        email: await this.cryptoService.decrypt(user.email),
        phone: await this.cryptoService.decrypt(user.phone)
      })));
      return {
        users: decryptedUsers,
        total,
        page,
        limit
      };
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `An error occurred while fetching users: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      if (user) {
        user.firstName = await this.cryptoService.decrypt(user.firstName);
        user.lastName = await this.cryptoService.decrypt(user.lastName);
        user.email = await this.cryptoService.decrypt(user.email);
        user.phone = await this.cryptoService.decrypt(user.phone);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find user with id ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the user: ${error.message}`);
    }
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`Failed to find user with email ${email}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the user by email: ${error.message}`);
    }
  }
  async findOneByUserId(userId: string): Promise<any | null> {
    try {
      const user = await this.userModel.findOne({ userId }, 'roles.role_id').exec();
      const fullRoles = await this.roleService.find({ _id: { $in: user.roles.map(r => r.role_id) } , isActive: true }, 'rolePermissions');
      const combinedPermissions = [...new Set(fullRoles.flatMap(r => r.rolePermissions))];
      return combinedPermissions;
    } catch (error) {
      this.logger.error(`Failed to find user with userId ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the user by userId: ${error.message}`);
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
    try {
      // Encrypt sensitive user data if provided in update
      if (updateUserDto.firstName) {
        updateUserDto.firstName = await this.cryptoService.encrypt(updateUserDto.firstName);
      }
      if (updateUserDto.lastName) {
        updateUserDto.lastName = await this.cryptoService.encrypt(updateUserDto.lastName);
      }
      if (updateUserDto.email) {
        updateUserDto.email = await this.cryptoService.encrypt(updateUserDto.email);
      }
      if (updateUserDto.phone) {
        updateUserDto.phone = await this.cryptoService.encrypt(updateUserDto.phone);
      }
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    } catch (error) {
      this.logger.error(`Failed to update user with id ${id}: ${error}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while updating the user: ${error.message}`);
    }
  }

  async remove(id: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(
        `Failed to delete user with id ${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while deleting the user: ${error.message}`,
      );
    }
  }

  // Get current user profile from JWT token
  async getCurrentUserProfile(userId: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({ userId }).exec();
      if (!user) {
        throw new NotFoundException(`User with userId ${userId} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to get current user profile: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while fetching the current user profile: ${error.message}`,
      );
    }
  }

  // Search users with filters
  async searchUsers(query: string, filters?: any): Promise<UserDocument[]> {
    try {
      const searchQuery: any = {};
      if (query) {
        searchQuery.$or = [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phone: { $regex: query, $options: 'i' } },
        ];
      }

      // Apply additional filters if provided
      if (filters) {
        Object.assign(searchQuery, filters);
      }

      return await this.userModel.find(searchQuery).exec();
    } catch (error) {
      this.logger.error(
        `Failed to search users: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while searching users: ${error.message}`,
      );
    }
  }

  // Confirm user registration
  async confirmRegistration(email: string, code: string): Promise<UserDocument | null> {
    try {
      this.logger.warn('confirmRegistration method needs implementation');
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to confirm registration: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `An error occurred while confirming registration: ${error.message}`,
      );
    }
  }


  async updateDirectPermissions(body: { userId: string, directPermissions: string[] }) {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate({ userId: body.userId }, { directPermissions: body.directPermissions }, { new: true }).exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with userId ${body.userId} not found`);
      }
      return { message: 'Direct permissions updated' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update direct permissions: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while updating direct permissions: ${error.message}`);
    }
  }

  async getModulesUserWithPermissions(allUserPermissions: string[]) {
    try {
      if (!Array.isArray(allUserPermissions) || allUserPermissions.length === 0) {
        throw new NotFoundException(`No permissions provided for this user`);
      }
      const slugs = Array.from(allUserPermissions.map(p => p.split(':')[0]));
      const modules = await this.moduleService.slug(slugs);
      // Filter the submodules and top-level modules
      const result = modules.map(mod => {
        const filteredSubModules = (mod.subModules || []).filter(sub => slugs.includes(sub.slug));
        const isModuleAllowed = slugs.includes(mod.slug);
        if (isModuleAllowed || filteredSubModules.length > 0) {
          return {
            _id: mod._id,
            name: mod.name,
            slug: mod.slug,
            permissions: allUserPermissions.filter(p => p.startsWith(`${mod.slug}:`)),
            subModules: filteredSubModules.map(sub => ({
              name: sub.name,
              slug: sub.slug,
              permissions: allUserPermissions.filter(p => p.startsWith(`${sub.slug}:`)),
            })),
          };
        }
        return null;
      })
        .filter(Boolean);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to get modules user with permissions: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `An error occurred while getting modules user with permissions: ${error.message}`
      );
    }
  }

} 