import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HealthService {
  private readonly services: { [key: string]: string };

  constructor(private readonly configService: ConfigService) {
    this.services = {
      'auth-service': this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001',
      'user-service': this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3002',
      'coaching-service': this.configService.get<string>('COACHING_SERVICE_URL') || 'http://localhost:3003',
      'event-service': this.configService.get<string>('EVENT_SERVICE_URL') || 'http://localhost:3005',
      'training-service': this.configService.get<string>('TRAINING_SERVICE_URL') || 'http://localhost:3006',
    };
  }

  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }

  async checkServices() {
    const serviceChecks = await Promise.allSettled(
      Object.entries(this.services).map(async ([name, url]) => {
        try {
          await axios.get(`${url}/api/v1/health`, { timeout: 5000 });
          return { name, status: 'ok' };
        } catch (error) {
          return { name, status: 'error' };
        }
      }),
    );

    const services = {};
    serviceChecks.forEach((result, index) => {
      const serviceName = Object.keys(this.services)[index];
      if (result.status === 'fulfilled') {
        services[serviceName] = result.value;
      } else {
        services[serviceName] = { status: 'error' };
      }
    });

    return { services };
  }
}
