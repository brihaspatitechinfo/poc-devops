import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UtilityService } from './utility.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

@ApiTags('Utilities')
@Controller('utility')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

  // Catch-all route for utility endpoints - proxy to utility service
  @All('*')
  async proxyToUtilityService(@Req() req: Request, @Res() res: Response) {
    return this.utilityService.proxyRequest(req, res);
  }
} 