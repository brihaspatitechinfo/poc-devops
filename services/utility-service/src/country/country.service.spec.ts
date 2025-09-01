import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryService } from './country.service';
import { Country } from './country.entity';
import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('CountryService', () => {
  let service: CountryService;
  let repository: Repository<Country>;
  let mockQueryRunner: any;

  const mockCountry: Country = {
    id: 1,
    name: 'United States',
    shortname: 'USA',
    dialCode: 1,
    status: 1,
    states: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    }),
  };

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn(),
          getMany: jest.fn(),
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<Repository<Country>>(getRepositoryToken(Country));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active countries', async () => {
      const mockCountries = [mockCountry];
      mockRepository.find.mockResolvedValue(mockCountries);

      const result = await service.findAll();

      expect(result).toEqual(mockCountries);
      expect(repository.find).toHaveBeenCalledWith({
        where: { status: 1 },
        order: { name: 'ASC' },
      });
    });

    it('should throw BadRequestException on error', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAllWithFilters', () => {
    it('should return countries with filters', async () => {
      const mockCountries = [mockCountry];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockCountries),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAllWithFilters({ active: 'true' });

      expect(result).toEqual(mockCountries);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('country');
    });

    it('should throw BadRequestException on error', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findAllWithFilters({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return country by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockCountry);

      const result = await service.findById(1);

      expect(result).toEqual(mockCountry);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, status: 1 },
        relations: ['states'],
      });
    });

    it('should throw NotFoundException when country not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on database error', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findById(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a country', async () => {
      const updateCountryDto = { name: 'Updated Country Name' };
      mockQueryRunner.manager.findOne.mockResolvedValue(mockCountry);
      mockQueryRunner.manager.save.mockResolvedValue({ ...mockCountry, ...updateCountryDto });

      const result = await service.update(1, updateCountryDto);

      expect(result).toEqual({ ...mockCountry, ...updateCountryDto });
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Country, {
        where: { id: 1, status: 1 }
      });
    });

    it('should throw NotFoundException when country not found', async () => {
      const updateCountryDto = { name: 'Updated Country Name' };
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateCountryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a country', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(mockCountry);
      mockQueryRunner.manager.remove.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Country, {
        where: { id: 1, status: 1 }
      });
      expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(Country, mockCountry);
    });

    it('should throw NotFoundException when country not found', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a country', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(mockCountry);
      mockQueryRunner.manager.update.mockResolvedValue({ affected: 1 });

      await service.softDelete(1);

      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Country, {
        where: { id: 1, status: 1 }
      });
      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(Country, 1, { status: 0 });
    });

    it('should throw NotFoundException when country not found', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(service.softDelete(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 