import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check for API Gateway' })
  @ApiResponse({ status: 200, description: 'API Gateway is healthy' })
  async check() {
    return this.healthService.check();
  }

  @Get('services')
  @ApiOperation({ summary: 'Check health of all microservices' })
  @ApiResponse({ status: 200, description: 'Microservices health status' })
  async checkServices() {
    return this.healthService.checkServices();
  }
}
