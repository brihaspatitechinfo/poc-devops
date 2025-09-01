import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EngagementService } from './engagement.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

@ApiTags('Engagement')
@Controller('engagement')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  // Proxy all engagement requests to engagement service
  @All()
  async proxyToEngagementServiceRoot(@Req() req: Request, @Res() res: Response) {
    return this.engagementService.proxyRequest(req, res);
  }

  @All('*')
  async proxyToEngagementService(@Req() req: Request, @Res() res: Response) {
    return this.engagementService.proxyRequest(req, res);
  }
} 