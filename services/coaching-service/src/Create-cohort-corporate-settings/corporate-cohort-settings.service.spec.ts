import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CorporateCohortSettingsService } from './corporate-cohort-settings.service';
import { WitSelectCorporateCohortSettings } from './entities/wit-select-corporate-cohort-settings.entity';
import { WitSelectCorporateUnlimitedPrices } from './entities/wit-select-corporate-unlimited-prices.entity';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCorporateCohortSettingsDto } from './dto/create-corporate-cohort-settings.dto';
import { CreateCorporateUnlimitedPricesDto } from './dto/create-corporate-unlimited-prices.dto';

describe('CorporateCohortSettingsService', () => {
  let service: CorporateCohortSettingsService;
  let settingsRepo: Repository<WitSelectCorporateCohortSettings>;
  let unlimitedRepo: Repository<WitSelectCorporateUnlimitedPrices>;

  const mockSettingsRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockUnlimitedRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  let mockManager;

  beforeEach(async () => {
    mockManager = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn((entity, data) => data),
      find: jest.fn(), // <-- Added find
    };
    mockDataSource.transaction.mockImplementation(async (cb) => cb(mockManager));
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorporateCohortSettingsService,
        { provide: getRepositoryToken(WitSelectCorporateCohortSettings), useValue: mockSettingsRepo },
        { provide: getRepositoryToken(WitSelectCorporateUnlimitedPrices), useValue: mockUnlimitedRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();
    service = module.get(CorporateCohortSettingsService);
    settingsRepo = module.get(getRepositoryToken(WitSelectCorporateCohortSettings));
    unlimitedRepo = module.get(getRepositoryToken(WitSelectCorporateUnlimitedPrices));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new settings if not duplicate', async () => {
      mockManager.findOne.mockResolvedValue(null);
      mockManager.save.mockResolvedValue({ id: 1 });
      const dto: CreateCorporateCohortSettingsDto = { corporateId: 'corp1', isUnlimited: 0 } as any;
      const result = await service.create(dto);
      expect(result).toEqual({ id: 1 });
    });
    it('should throw if duplicate corporateId', async () => {
      mockManager.findOne.mockResolvedValue({ id: 1 });
      const dto: CreateCorporateCohortSettingsDto = { corporateId: 'corp1', isUnlimited: 0 } as any;
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
    it('should throw if unlimited but no prices', async () => {
      mockManager.findOne.mockResolvedValue(null);
      const dto: CreateCorporateCohortSettingsDto = { corporateId: 'corp1', isUnlimited: 1 } as any;
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all settings', async () => {
      mockSettingsRepo.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should return one if found', async () => {
      mockSettingsRepo.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1 });
    });
    it('should throw if not found', async () => {
      mockSettingsRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return updated', async () => {
      mockManager.update.mockResolvedValue(undefined);
      mockManager.findOne.mockResolvedValue({ id: 1, corporateId: 'corp1' });
      mockManager.delete.mockResolvedValue(undefined);
      await service.update(1, { isUnlimited: 0 }); // The service returns void
      expect(mockManager.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete if found', async () => {
      mockManager.findOne.mockResolvedValue({ id: 1, corporateId: 'corp1' });
      mockManager.delete.mockResolvedValue(undefined);
      mockManager.delete.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
    it('should throw if not found', async () => {
      mockManager.findOne.mockResolvedValue(undefined);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unlimited prices', () => {
    it('should return all unlimited prices', async () => {
      mockUnlimitedRepo.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAllUnlimitedPrices();
      expect(result).toEqual([{ id: 1 }]);
    });
    it('should return prices by corporateId', async () => {
      mockUnlimitedRepo.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.findUnlimitedPricesByCorporateId('corp1');
      expect(result).toEqual([{ id: 1 }]);
    });
    it('should return one unlimited price if found', async () => {
      mockUnlimitedRepo.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findUnlimitedPriceOne(1);
      expect(result).toEqual({ id: 1 });
    });
    it('should throw if unlimited price not found', async () => {
      mockUnlimitedRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findUnlimitedPriceOne(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 