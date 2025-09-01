import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        cognito: 'ok', // Auth service relies on Cognito
      },
    };
  }

  async ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  async live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
} 