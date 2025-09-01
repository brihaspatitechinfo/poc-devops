import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Proxy all notifications requests to notifications service
  @All()
  async proxyToNotificationsServiceRoot(@Req() req: Request, @Res() res: Response) {
    return this.notificationsService.proxyRequest(req, res);
  }

  @All('*')
  async proxyToNotificationsService(@Req() req: Request, @Res() res: Response) {
    return this.notificationsService.proxyRequest(req, res);
  }
}
