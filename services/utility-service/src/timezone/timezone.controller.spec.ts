import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTimezoneMasterDto } from './dto/create-timezone-master.dto';
import { TimezoneMasterResponseDto } from './dto/timezone-master-response.dto';
import { TimezoneController } from './timezone.controller';
import { TimezoneService } from './timezone.service';

describe('TimezoneController', () => {
  let controller: TimezoneController;
  let service: TimezoneService;

  const mockTimezone: TimezoneMasterResponseDto = {
    id: 1,
    timezoneValue: 'Asia/Kolkata',
    timezoneAbbr: 'IST',
    timezoneOffset: '+05:30',
    isdst: false,
    timezoneText: 'India Standard Time',
  };

  const mockTimezoneService = {
    findAllWithFilters: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getTimezoneStats: jest.fn(),
    getTimezoneAbbrList: jest.fn(),
    getDefaultTimezone: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimezoneController],
      providers: [
        {
          provide: TimezoneService,
          useValue: mockTimezoneService,
        },
      ],
    }).compile();

    controller = module.get<TimezoneController>(TimezoneController);
    service = module.get<TimezoneService>(TimezoneService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all timezones with filters', async () => {
      const mockTimezones = [mockTimezone];
      jest.spyOn(service, 'findAllWithFilters').mockResolvedValue(mockTimezones);

      const result = await controller.findAll({});

      expect(result).toEqual(mockTimezones);
      expect(service.findAllWithFilters).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      jest.spyOn(service, 'findAllWithFilters').mockRejectedValue(new BadRequestException('Database error'));

      await expect(controller.findAll({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a timezone by ID', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockTimezone);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockTimezone);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new timezone', async () => {
      const createTimezoneDto: CreateTimezoneMasterDto = {
        timezoneValue: 'Asia/Kolkata',
        timezoneAbbr: 'IST',
        timezoneOffset: '+05:30',
        isdst: false,
        timezoneText: 'India Standard Time'
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockTimezone);

      const result = await controller.create(createTimezoneDto);

      expect(result).toEqual(mockTimezone);
      expect(service.create).toHaveBeenCalledWith(createTimezoneDto);
    });
  });

  describe('update', () => {
    it('should update a timezone', async () => {
      const updateTimezoneDto = { timezoneText: 'Updated Timezone Text' };
      jest.spyOn(service, 'update').mockResolvedValue(mockTimezone);

      const result = await controller.update(1, updateTimezoneDto);

      expect(result).toEqual(mockTimezone);
      expect(service.update).toHaveBeenCalledWith(1, updateTimezoneDto);
    });
  });

  describe('remove', () => {
    it('should delete a timezone', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getDefault', () => {
    it('should return default timezone', async () => {
      jest.spyOn(service, 'getDefaultTimezone').mockResolvedValue(mockTimezone);

      const result = await controller.getDefault();

      expect(result).toEqual(mockTimezone);
      expect(service.getDefaultTimezone).toHaveBeenCalled();
    });
  });
}); 