import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';

@Injectable()
export class EventsService {
  private readonly eventServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL') || 'http://event-service:3005';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      const targetUrl = `${this.eventServiceUrl}${req.url}`;

      // Add user ID from JWT token to headers
      const headers: any = {
        'Content-Type': req.headers['content-type'],
        'Authorization': req.headers.authorization,
        'x-user-id': (req as any)?.user?.userId,
      };
      
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers,
        validateStatus: () => true,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({
        error: 'Event service unavailable',
        message: error.message
      });
    }
  }
}
