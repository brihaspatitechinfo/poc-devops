import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { Country } from './country.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockCountry: Country = {
    id: 1,
    shortname: 'USA',
    name: 'United States',
    dialCode: 1,
    status: 1,
    states: [],
  };

  const mockCountryService = {
    findAllWithFilters: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all countries with filters', async () => {
      const mockCountries = [mockCountry];
      jest.spyOn(service, 'findAllWithFilters').mockResolvedValue(mockCountries);

      const result = await controller.findAll({});

      expect(result).toEqual({
        success: true,
        data: mockCountries,
        message: 'Countries fetched successfully',
      });
      expect(service.findAllWithFilters).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      jest.spyOn(service, 'findAllWithFilters').mockRejectedValue(new BadRequestException('Database error'));

      await expect(controller.findAll({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return a country by ID', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockCountry);

      const result = await controller.findById(1);

      expect(result).toEqual({
        success: true,
        data: mockCountry,
        message: 'Country fetched successfully',
      });
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('dialCodeToCountry', () => {
    it('should return a country by dial code', async () => {
      jest.spyOn(service, 'dialCodeToCountry').mockResolvedValue(mockCountry);

      const result = await controller.dialCodeToCountry(1);

      expect(result).toEqual(mockCountry);
      expect(service.dialCodeToCountry).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a country', async () => {
      const updateCountryDto = { name: 'Updated Country Name' };
      jest.spyOn(service, 'update').mockResolvedValue(mockCountry);

      const result = await controller.update(1, updateCountryDto);

      expect(result).toEqual({
        success: true,
        data: mockCountry,
        message: 'Country updated successfully',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateCountryDto);
    });
  });

  describe('delete', () => {
    it('should delete a country', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result).toEqual({
        success: true,
        message: 'Country deleted successfully',
      });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a country', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValue(undefined);

      const result = await controller.softDelete(1);

      expect(result).toEqual({
        success: true,
        message: 'Country soft deleted successfully',
      });
      expect(service.softDelete).toHaveBeenCalledWith(1);
    });
  });
}); 