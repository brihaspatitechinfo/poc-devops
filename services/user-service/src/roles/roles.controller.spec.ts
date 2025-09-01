import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppLogger } from '../logger/logger.service';
import { PermissionsService } from '../permissions/permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';



describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;
  let logger: AppLogger;

  const mockRole = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'admin',
    slug: 'admin',
    description: 'Full system administrator',
    role_permissions: ['665fcd6fa91434d14f8d1001', '665fcd6fa91434d14f8d1002'],
    isActive: true,
    createdBy: new Types.ObjectId('507f1f77bcf86cd799439012'),
    updatedBy: new Types.ObjectId('507f1f77bcf86cd799439012'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRolesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const mockLogger = {
    error: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const mockPermissionsService = {
    getUserPermissions: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
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

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
    logger = module.get<AppLogger>(AppLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role successfully', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        slug: 'admin',
        description: 'Full system administrator',
        rolePermissions: ['user:create', 'user:read', 'user:update', 'user:delete'],
        isActive: true,
        createdBy: new Types.ObjectId('507f1f77bcf86cd799439012'),
      };
      mockRolesService.create.mockResolvedValue(mockRole);
      const result = await controller.create(createRoleDto);
      expect(result).toEqual(mockRole);
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('should handle service errors and throw InternalServerErrorException', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        slug: 'admin',
        description: 'Full system administrator',
        createdBy: new Types.ObjectId('507f1f77bcf86cd799439012'),
      };

      const error = new Error('Service error');
      mockRolesService.create.mockRejectedValue(error);
      await expect(controller.create(createRoleDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error creating role: Error: Service error. Please try again later or contact support if the issue persists.'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all roles when no filters provided', async () => {
      mockRolesService.findAll.mockResolvedValue([mockRole]);
      const result = await controller.findAll();
      expect(result).toEqual([mockRole]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all roles when active filter is false', async () => {
      mockRolesService.findAll.mockResolvedValue([mockRole]);

      const result = await controller.findAll();

      expect(result).toEqual([mockRole]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no roles found', async () => {
      mockRolesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual({ status: HttpStatus.NO_CONTENT, data: [] });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockRolesService.findAll.mockRejectedValue(error);
      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error retrieving roles: Error: Service error. Please try again later or contact support if the issue persists.'),
      );
    });
  });



  describe('findOne', () => {
    it('should return a role by id', async () => {
      mockRolesService.findById.mockResolvedValue(mockRole);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockRole);
      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should return empty array when role not found', async () => {
      mockRolesService.findById.mockResolvedValue(null);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual({ status: HttpStatus.NO_CONTENT, data: [] });
    });
  });



  describe('update', () => {
    it('should update a role successfully', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'Updated Administrator',
        description: 'Updated description',
      };

      const updatedRole = { ...mockRole, ...updateRoleDto };
      mockRolesService.update.mockResolvedValue(updatedRole);
      const result = await controller.update('507f1f77bcf86cd799439011', updateRoleDto);
      expect(result).toEqual(updatedRole);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateRoleDto);
    });

    it('should handle service errors', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'Updated Administrator',
      };

      const error = new Error('Service error');
      mockRolesService.update.mockRejectedValue(error);

      await expect(
        controller.update('507f1f77bcf86cd799439011', updateRoleDto),
      ).rejects.toThrow(InternalServerErrorException);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error updating role: Error: Service error. Please verify the data and try again or contact support if the issue persists.'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a role successfully', async () => {
      mockRolesService.delete.mockResolvedValue(mockRole);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockRole);
      expect(service.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockRolesService.delete.mockRejectedValue(error);

      await expect(controller.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error deleting role: Error: Service error. Please verify the ID and try again or contact support if the issue persists.'),
      );
    });
  });
}); 