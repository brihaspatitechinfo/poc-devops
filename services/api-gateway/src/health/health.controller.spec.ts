import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../modules/health/health.controller';
import { HealthService } from '../modules/health/health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  const mockHealthService = {
    check: jest.fn(),
    checkServices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', async () => {
      const expectedResult = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'api-gateway',
        version: '1.0.0',
      };

      mockHealthService.check.mockResolvedValue(expectedResult);

      const result = await controller.check();

      expect(service.check).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('checkServices', () => {
    it('should return microservices health status', async () => {
      const expectedResult = {
        status: 'ok',
        services: {
          'auth-service': { status: 'ok', responseTime: 50 },
          'user-service': { status: 'ok', responseTime: 45 },
        },
      };

      mockHealthService.checkServices.mockResolvedValue(expectedResult);

      const result = await controller.checkServices();

      expect(service.checkServices).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
