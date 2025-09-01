import { Test, TestingModule } from '@nestjs/testing';
import { LocationMasterController } from './location-master.controller';
import { LocationMasterService } from './location-master.service';
import { LocationMaster } from './location-master.entity';
import { BadRequestException } from '@nestjs/common';

describe('LocationMasterController', () => {
  let controller: LocationMasterController;
  let service: LocationMasterService;

  const mockLocation: LocationMaster = {
    id: 1,
    location: 'Mumbai',
    countryId: 1,
    sort: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLocationService = {
    findAllWithFilters: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationMasterController],
      providers: [
        {
          provide: LocationMasterService,
          useValue: mockLocationService,
        },
      ],
    }).compile();

    controller = module.get<LocationMasterController>(LocationMasterController);
    service = module.get<LocationMasterService>(LocationMasterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all locations with filters', async () => {
      const mockLocations = [mockLocation];
      jest.spyOn(service, 'findAllWithFilters').mockResolvedValue(mockLocations);

      const result = await controller.findAll({});

      expect(result).toEqual({
        success: true,
        data: mockLocations,
        message: 'Locations fetched successfully',
      });
      expect(service.findAllWithFilters).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      jest.spyOn(service, 'findAllWithFilters').mockRejectedValue(new BadRequestException('Database error'));

      await expect(controller.findAll({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return a location by ID', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockLocation);

      const result = await controller.findById(1);

      expect(result).toEqual({
        success: true,
        data: mockLocation,
        message: 'Location fetched successfully',
      });
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new location', async () => {
      const createLocationDto = { location: 'Mumbai', countryId: 1, sort: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(mockLocation);

      const result = await controller.create(createLocationDto);

      expect(result).toEqual({
        success: true,
        data: mockLocation,
        message: 'Location created successfully',
      });
      expect(service.create).toHaveBeenCalledWith(createLocationDto);
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const updateLocationDto = { location: 'Updated Location Name', sort: 2 };
      jest.spyOn(service, 'update').mockResolvedValue(mockLocation);

      const result = await controller.update(1, updateLocationDto);

      expect(result).toEqual({
        success: true,
        data: mockLocation,
        message: 'Location updated successfully',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateLocationDto);
    });
  });

  describe('delete', () => {
    it('should delete a location', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result).toEqual({
        success: true,
        message: 'Location deleted successfully',
      });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
}); 