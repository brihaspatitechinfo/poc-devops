import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';


describe('CurrencyController', () => {
  let controller: CurrencyController;
  let service: CurrencyService;

  const mockCurrency: Currency = {
    id: 1,
    currency: 'US Dollar',
    code: 'USD',
    symbol: '$',
    status: 1,
    decimalDigits: '2',
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCurrencyService = {
    findAllWithFilters: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: mockCurrencyService,
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all currencies with filters', async () => {
      const mockCurrencies = [mockCurrency];
      jest.spyOn(service, 'findAllWithFilters').mockResolvedValue(mockCurrencies);

      const result = await controller.findAll({});

      expect(result).toEqual({
        success: true,
        data: mockCurrencies,
        message: 'Currencies fetched successfully',
      });
      expect(service.findAllWithFilters).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      jest.spyOn(service, 'findAllWithFilters').mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll({})).rejects.toThrow(Error);
    });
  });

  describe('findById', () => {
    it('should return a currency by ID', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockCurrency);

      const result = await controller.findById(1);

      expect(result).toEqual({
        success: true,
        data: mockCurrency,
        message: 'Currency fetched successfully',
      });
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new currency', async () => {
      const createCurrencyDto = { currency: 'US Dollar', code: 'USD', symbol: '$' };
      jest.spyOn(service, 'create').mockResolvedValue(mockCurrency);

      const result = await controller.create(createCurrencyDto);

      expect(result).toEqual({
        success: true,
        data: mockCurrency,
        message: 'Currency created successfully',
      });
      expect(service.create).toHaveBeenCalledWith(createCurrencyDto);
    });
  });

  describe('update', () => {
    it('should update a currency', async () => {
      const updateCurrencyDto = { currency: 'Updated Currency Name', symbol: '€' };
      jest.spyOn(service, 'update').mockResolvedValue(mockCurrency);

      const result = await controller.update(1, updateCurrencyDto);

      expect(result).toEqual({
        success: true,
        data: mockCurrency,
        message: 'Currency updated successfully',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateCurrencyDto);
    });
  });

  describe('delete', () => {
    it('should delete a currency', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result).toEqual({
        success: true,
        message: 'Currency deleted successfully',
      });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a currency', async () => {
      jest.spyOn(service, 'softDelete').mockResolvedValue(undefined);

      const result = await controller.softDelete(1);

      expect(result).toEqual({
        success: true,
        message: 'Currency soft deleted successfully',
      });
      expect(service.softDelete).toHaveBeenCalledWith(1);
    });
  });
}); 