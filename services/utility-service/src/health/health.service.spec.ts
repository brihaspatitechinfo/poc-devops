import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return health status with all required fields', async () => {
      const result = await service.check();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('checks');
      expect(result.status).toBe('ok');
      expect(result.checks).toHaveProperty('utilities');
      expect(result.checks.utilities).toBe('ok');
    });

    it('should return valid timestamp', async () => {
      const result = await service.check();
      const timestamp = new Date(result.timestamp);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should return valid uptime', async () => {
      const result = await service.check();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('ready', () => {
    it('should return readiness status', async () => {
      const result = await service.ready();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result.status).toBe('ready');
    });

    it('should return valid timestamp', async () => {
      const result = await service.ready();
      const timestamp = new Date(result.timestamp);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });
  });

  describe('live', () => {
    it('should return liveness status', async () => {
      const result = await service.live();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result.status).toBe('alive');
    });

    it('should return valid timestamp', async () => {
      const result = await service.live();
      const timestamp = new Date(result.timestamp);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should return valid uptime', async () => {
      const result = await service.live();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });
}); 