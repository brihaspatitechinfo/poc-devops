import {
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from '../logger/logger.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';


describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;
  let logger: AppLogger;

  const mockPermission = {
    _id: '665ffe123b7a4b0df8f12345',
    name: 'Can create User',
    description: 'Allows creation of new users',
    slug: 'user:create',
    module: 'user',
    action: 'create',
    createdAt: new Date('2025-06-20T09:32:11.123Z'),
    updatedAt: new Date('2025-06-20T09:32:11.123Z'),
  };

  const mockPermissionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  const mockAppLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
        {
          provide: AppLogger,
          useValue: mockAppLogger,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
      .overrideGuard('PermissionsGuard')
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
    logger = module.get<AppLogger>(AppLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'Can create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        action: 'create',
        module: 'user',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockPermission as any);
      jest.spyOn(logger, 'log').mockImplementation();

      const result = await controller.create(createPermissionDto);

      expect(service.create).toHaveBeenCalledWith(createPermissionDto);
      expect(logger.log).toHaveBeenCalledWith(
        `Permission created successfully with ID: ${mockPermission._id}`,
      );
      expect(result).toEqual(mockPermission);
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'Can create User',
        description: 'Allows creation of new users',
        slug: 'user:create',
        action: 'create',
        module: 'user'
      };

      const error = new Error('Database error');
      jest.spyOn(service, 'create').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.create(createPermissionDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating permission: Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const mockPermissions = [mockPermission];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockPermissions as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPermissions);
    });

    it('should throw InternalServerErrorException when fetching fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error retrieving permissions: Database error',
      );
    });
  });

  describe('findOne', () => {
    it('should return a permission by ID', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockPermission as any);

      const result = await controller.findOne('665ffe123b7a4b0df8f12345');

      expect(service.findOne).toHaveBeenCalledWith('665ffe123b7a4b0df8f12345');
      expect(result).toEqual(mockPermission);
    });

    it('should throw InternalServerErrorException when fetching by ID fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.findOne('665ffe123b7a4b0df8f12345')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error retrieving permission: Error: Database error',
      );
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'Updated Permission',
        description: 'Updated description',
      };

      const updatedPermission = { ...mockPermission, ...updatePermissionDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedPermission as any);
      jest.spyOn(logger, 'log').mockImplementation();

      const result = await controller.update('665ffe123b7a4b0df8f12345', updatePermissionDto);

      expect(service.update).toHaveBeenCalledWith('665ffe123b7a4b0df8f12345', updatePermissionDto);
      expect(logger.log).toHaveBeenCalledWith(
        'Updating permission with ID: 665ffe123b7a4b0df8f12345',
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Permission updated successfully with ID: ${updatedPermission._id}`,
      );
      expect(result).toEqual(updatedPermission);
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'Updated Permission',
      };

      const error = new Error('Database error');
      jest.spyOn(service, 'update').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(
        controller.update('665ffe123b7a4b0df8f12345', updatePermissionDto),
      ).rejects.toThrow(InternalServerErrorException);
      expect(logger.error).toHaveBeenCalledWith(
        'Error updating permission: Error: Database error',
      );
    });
  });

  describe('remove', () => {
    it('should delete a permission', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockPermission as any);
      jest.spyOn(logger, 'log').mockImplementation();

      const result = await controller.remove('665ffe123b7a4b0df8f12345');

      expect(service.remove).toHaveBeenCalledWith('665ffe123b7a4b0df8f12345');
      expect(logger.log).toHaveBeenCalledWith(
        'Deleting permission with ID: 665ffe123b7a4b0df8f12345',
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Permission deleted successfully with ID: ${mockPermission._id}`,
      );
      expect(result).toEqual(mockPermission);
    });

    it('should throw InternalServerErrorException when deletion fails', async () => {
      const error = new Error('Database error');
      jest.spyOn(service, 'remove').mockRejectedValue(error);
      jest.spyOn(logger, 'error').mockImplementation();

      await expect(controller.remove('665ffe123b7a4b0df8f12345')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting permission: Error: Database error',
      );
    });
  });
});
