import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class EngagementService {
  private readonly engagementServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.engagementServiceUrl = this.configService.get<string>('ENGAGEMENT_SERVICE_URL') || 'http://engagement-service:3007';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      // Use the full request URL including the /api/v1 prefix
      const targetUrl = `${this.engagementServiceUrl}${req.url}`;

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
        error: 'Engagement service unavailable',
        message: error.message
      });
    }
  }
} 