import { Test, TestingModule } from '@nestjs/testing';
import { CorporateCohortSettingsController } from './corporate-cohort-settings.controller';
import { CorporateCohortSettingsService } from './corporate-cohort-settings.service';
import { HttpStatus } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

describe('CorporateCohortSettingsController', () => {
  let controller: CorporateCohortSettingsController;
  let service: CorporateCohortSettingsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllUnlimitedPrices: jest.fn(),
    findUnlimitedPricesByCorporateId: jest.fn(),
    findUnlimitedPriceOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateCohortSettingsController],
      providers: [
        { provide: CorporateCohortSettingsService, useValue: mockService },
      ],
    }).compile();
    controller = module.get(CorporateCohortSettingsController);
    service = module.get(CorporateCohortSettingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created response', async () => {
      mockService.create.mockResolvedValue({ id: 1 });
      const dto = { corporateId: 'corp1' };
      const result = await controller.create(dto as any);
      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.data).toEqual({ id: 1 });
    });
    it('should handle error', async () => {
      mockService.create.mockRejectedValue(new BadRequestException('fail'));
      const dto = { corporateId: 'corp1' };
      await expect(controller.create(dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all settings', async () => {
      mockService.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await controller.findAll();
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should return one', async () => {
      mockService.findOne.mockResolvedValue({ id: 1 });
      const result = await controller.findOne(1);
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual({ id: 1 });
    });
    it('should handle error', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('not found'));
      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated', async () => {
      const expectedResponse = {
        statusCode: HttpStatus.OK,
        message: 'Corporate cohort setting updated',
      };
      mockService.update.mockResolvedValue({ message: 'Corporate cohort setting updated' }); // Align with service response
      const result = await controller.update(1, {});
      expect(result).toEqual(expectedResponse);
    });
    it('should handle error', async () => {
      mockService.update.mockRejectedValue(new BadRequestException('fail'));
      await expect(controller.update(1, {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should return deleted', async () => {
      mockService.remove.mockResolvedValue(undefined);
      const result = await controller.remove(1);
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toBeNull();
    });
    it('should handle error', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException('not found'));
      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllUnlimitedPrices', () => {
    it('should return all unlimited prices', async () => {
      mockService.findAllUnlimitedPrices.mockResolvedValue([{ id: 1 }]);
      const result = await controller.findAllUnlimitedPrices();
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual([{ id: 1 }]);
    });
  });

  describe('findUnlimitedPricesByCorporateId', () => {
    it('should return prices for corporate', async () => {
      mockService.findUnlimitedPricesByCorporateId.mockResolvedValue([{ id: 1 }]);
      const result = await controller.findUnlimitedPricesByCorporateId('corp1');
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual([{ id: 1 }]);
    });
  });

  describe('findUnlimitedPriceOne', () => {
    it('should return one unlimited price', async () => {
      mockService.findUnlimitedPriceOne.mockResolvedValue({ id: 1 });
      const result = await controller.findUnlimitedPriceOne('1');
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual({ id: 1 });
    });
  });
}); 