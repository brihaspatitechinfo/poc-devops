import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly notificationServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.notificationServiceUrl = this.configService.get<string>('NOTIFICATION_SERVICE_URL') || 'http://notification-service:3008';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      // Use the full request URL including the /api/v1 prefix
      const targetUrl = `${this.notificationServiceUrl}${req.url}`;

      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: {
          'Content-Type': req.headers['content-type'],
          'Authorization': req.headers.authorization,
        },
        validateStatus: () => true,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({
        error: 'Notification service unavailable',
        message: error.message
      });
    }
  }
}
