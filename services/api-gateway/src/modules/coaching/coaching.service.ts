import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class CoachingService {
  private readonly coachingServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.coachingServiceUrl = this.configService.get<string>('COACHING_SERVICE_URL') || 'http://coaching-service:3003';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      const targetUrl = `${this.coachingServiceUrl}${req.url}`;

      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: {
          'Content-Type': req.headers['content-type'],
          'Authorization': req.headers.authorization,
          'x-user-id': (req as any)?.user?.userId
        },
        validateStatus: () => true,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({
        error: 'Coaching service unavailable',
        message: error.message
      });
    }
  }
}


