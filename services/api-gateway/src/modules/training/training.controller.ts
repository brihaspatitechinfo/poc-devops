import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TrainingService } from './training.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

@ApiTags('Training')
@Controller('training')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  // Proxy all training requests to training service
  @All()
  async proxyToTrainingServiceRoot(@Req() req: Request, @Res() res: Response) {
    return this.trainingService.proxyRequest(req, res);
  }

  @All('*')
  async proxyToTrainingService(@Req() req: Request, @Res() res: Response) {
    return this.trainingService.proxyRequest(req, res);
  }
}
