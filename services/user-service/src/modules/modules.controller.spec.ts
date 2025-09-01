import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from '../logger/logger.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

// Mock the guards
jest.mock('../auth/jwt-auth.guard');
jest.mock('../permissions/permissions.guard');

describe('ModulesController', () => {
  let controller: ModulesController;
  let service: ModulesService;
  let logger: AppLogger;

  const mockModule = {
    _id: '665ffe123b7a4b0df8f12345',
    name: 'User Management',
    slug: 'mod_user_mgmt',
    description: 'Top-level user module',
    subModules: [],
    isActive: true,
    createdAt: new Date('2025-06-20T09:32:11.123Z'),
    updatedAt: new Date('2025-06-20T09:32:11.123Z'),
  };

  const mockModulesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAppLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [
        {
          provide: ModulesService,
          useValue: mockModulesService,
        },
        {
          provide: AppLogger,
          useValue: mockAppLogger,
        },
      ],
    })
      .overrideGuard('JwtAuthGuard')
      .useValue({ canActivate: () => true })
      .overrideGuard('PermissionsGuard')
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ModulesController>(ModulesController);
    service = module.get<ModulesService>(ModulesService);
    logger = module.get<AppLogger>(AppLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new module', async () => {
      const createModuleDto: CreateModuleDto = {
        name: 'User Management',
        slug: 'mod_user_mgmt',
        description: 'Top-level user module',
        isActive: true,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockModule as any);

      const result = await controller.create(createModuleDto);

      expect(service.create).toHaveBeenCalledWith(createModuleDto);
      expect(result).toEqual(mockModule);
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      const createModuleDto: CreateModuleDto = {
        name: 'User Management',
        slug: 'mod_user_mgmt',
        description: 'Top-level user module',
        isActive: true,
      };

      const error = new Error('Database error');
      jest.spyOn(service, 'create').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.create(createModuleDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating module: Error: Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all modules', async () => {
      const mockModules = [mockModule];
      jest.spyOn(service, 'findAll').mockResolvedValue({ modules: mockModules, total: 1, page: 1, limit: 10 } as any);
      const result = await controller.findAll(1, 10, true);
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockModules);
    });
    it('should throw InternalServerErrorException when fetching fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error retrieving modules: Error: Database error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a module by ID', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockModule as any);
      jest.spyOn(logger, 'log').mockImplementation();

      const result = await controller.findOne('665ffe123b7a4b0df8f12345');

      expect(service.findOne).toHaveBeenCalledWith('665ffe123b7a4b0df8f12345');
      expect(logger.log).toHaveBeenCalledWith(
        'Fetching module by ID: 665ffe123b7a4b0df8f12345',
      );
      expect(result).toEqual(mockModule);
    });

    it('should return not found message when module not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);
      jest.spyOn(logger, 'log').mockImplementation();
      jest.spyOn(logger, 'warn').mockImplementation();

      const result = await controller.findOne('nonexistent');

      expect(service.findOne).toHaveBeenCalledWith('nonexistent');
      expect(logger.warn).toHaveBeenCalledWith(
        'Module not found by ID: nonexistent',
      );
      expect(result).toEqual({ message: 'Module not found' });
    });

    it('should throw InternalServerErrorException when fetching by ID fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.findOne('665ffe123b7a4b0df8f12345')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error retrieving module by ID: Error: Database error',
      );
    });
  });

  describe('update', () => {
    it('should update a module', async () => {
      const updateModuleDto: UpdateModuleDto = {
        name: 'Updated User Management',
        isActive: false,
      };

      const updatedModule = { ...mockModule, ...updateModuleDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedModule as any);
      jest.spyOn(logger, 'log').mockImplementation();

      const result = await controller.update('665ffe123b7a4b0df8f12345', updateModuleDto);

      expect(service.update).toHaveBeenCalledWith('665ffe123b7a4b0df8f12345', updateModuleDto);
      expect(logger.log).toHaveBeenCalledWith(
        'Updating module with ID: 665ffe123b7a4b0df8f12345',
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Module updated successfully with ID: ${updatedModule._id}`,
      );
      expect(result).toEqual(updatedModule);
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      const updateModuleDto: UpdateModuleDto = {
        name: 'Updated User Management',
      };

      const error = new Error('Database error');
      jest.spyOn(service, 'update').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(
        controller.update('665ffe123b7a4b0df8f12345', updateModuleDto),
      ).rejects.toThrow(InternalServerErrorException);
      expect(logger.error).toHaveBeenCalledWith(
        'Error updating module: Error: Database error',
      );
    });
  });

  describe('remove', () => {
    it('should delete a module', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockModule as any);
      jest.spyOn(logger, 'log').mockImplementation();

      const result = await controller.remove('665ffe123b7a4b0df8f12345');

      expect(service.remove).toHaveBeenCalledWith('665ffe123b7a4b0df8f12345');
      expect(logger.log).toHaveBeenCalledWith(
        'Deleting module with ID: 665ffe123b7a4b0df8f12345',
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Module deleted successfully with ID: ${mockModule._id}`,
      );
      expect(result).toEqual(mockModule);
    });

    it('should throw InternalServerErrorException when deletion fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'remove').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.remove('665ffe123b7a4b0df8f12345')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting module: Error: Database error',
      );
    });
  });
}); 