import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CoachingService } from './coaching.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

@ApiTags('Coaching')
@Controller('coaching')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CoachingController {
  constructor(private readonly coachingService: CoachingService) {}

  // Proxy all coaching requests to coaching service
  @All()
  async proxyToCoachingServiceRoot(@Req() req: Request, @Res() res: Response) {
    return this.coachingService.proxyRequest(req, res);
  }

  @All('*')
  async proxyToCoachingService(@Req() req: Request, @Res() res: Response) {
    return this.coachingService.proxyRequest(req, res);
  }
}


