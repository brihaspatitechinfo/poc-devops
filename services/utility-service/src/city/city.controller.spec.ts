import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City } from './city.entity';


describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  const mockCity: City = {
    id: 1,
    name: 'Mumbai',
    stateId: 1,
    countryId: 1,
    state: null,
  };

  const mockCityService = {
    findAllWithFilters: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: mockCityService,
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cities with filters', async () => {
      const mockCities = [mockCity];
      jest.spyOn(service, 'findAllWithFilters').mockResolvedValue(mockCities);

      const result = await controller.findAll({});

      expect(result).toEqual({
        success: true,
        data: mockCities,
        message: 'Cities fetched successfully',
      });
      expect(service.findAllWithFilters).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      jest.spyOn(service, 'findAllWithFilters').mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll({})).rejects.toThrow(Error);
    });
  });

  describe('findById', () => {
    it('should return a city by ID', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockCity);

      const result = await controller.findById(1);

      expect(result).toEqual({
        success: true,
        data: mockCity,
        message: 'City fetched successfully',
      });
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const createCityDto = { name: 'Mumbai', stateId: 1, countryId: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(mockCity);

      const result = await controller.create(createCityDto);

      expect(result).toEqual({
        success: true,
        data: mockCity,
        message: 'City created successfully',
      });
      expect(service.create).toHaveBeenCalledWith(createCityDto);
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const updateCityDto = { name: 'Updated Mumbai' };
      jest.spyOn(service, 'update').mockResolvedValue(mockCity);

      const result = await controller.update(1, updateCityDto);

      expect(result).toEqual({
        success: true,
        data: mockCity,
        message: 'City updated successfully',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateCityDto);
    });
  });

  describe('delete', () => {
    it('should delete a city', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result).toEqual({
        success: true,
        message: 'City deleted successfully',
      });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
}); 