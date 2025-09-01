import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Proxy all events requests to events service
  @All()
  async proxyToEventsServiceRoot(@Req() req: Request, @Res() res: Response) {
    return this.eventsService.proxyRequest(req, res);
  }

  @All('*')
  async proxyToEventsService(@Req() req: Request, @Res() res: Response) {
    return this.eventsService.proxyRequest(req, res);
  }
}
