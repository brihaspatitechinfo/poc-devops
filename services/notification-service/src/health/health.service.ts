import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async check() {
    const isHealthy = await this.isDatabaseHealthy();
    
    if (isHealthy) {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        checks: {
          database: 'ok',
        },
      };
    } else {
      throw new Error('Service is unhealthy');
    }
  }

  async ready() {
    const isReady = await this.isDatabaseHealthy();
    
    if (isReady) {
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error('Service is not ready');
    }
  }

  async live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private async isDatabaseHealthy(): Promise<boolean> {
    try {
      await this.connection.db.admin().ping();
      return true;
    } catch (error) {
      return false;
    }
  }
}
