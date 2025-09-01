import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', async () => {
      const mockHealthData = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.456,
        version: '1.0.0',
        checks: {
          utilities: 'ok',
        },
      };

      jest.spyOn(service, 'check').mockResolvedValue(mockHealthData);

      const result = await controller.check();

      expect(result).toEqual(mockHealthData);
      expect(service.check).toHaveBeenCalled();
    });
  });

  describe('ready', () => {
    it('should return readiness status', async () => {
      const mockReadyData = {
        status: 'ready',
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      jest.spyOn(service, 'ready').mockResolvedValue(mockReadyData);

      const result = await controller.ready();

      expect(result).toEqual(mockReadyData);
      expect(service.ready).toHaveBeenCalled();
    });
  });

  describe('live', () => {
    it('should return liveness status', async () => {
      const mockLiveData = {
        status: 'alive',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 123.456,
      };

      jest.spyOn(service, 'live').mockResolvedValue(mockLiveData);

      const result = await controller.live();

      expect(result).toEqual(mockLiveData);
      expect(service.live).toHaveBeenCalled();
    });
  });
}); 