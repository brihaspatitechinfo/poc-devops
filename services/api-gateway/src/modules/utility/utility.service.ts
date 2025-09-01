import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class UtilityService {
  private readonly utilityServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.utilityServiceUrl = this.configService.get<string>('UTILITY_SERVICE_URL') || 'http://localhost:3008';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      const targetUrl = `${this.utilityServiceUrl}${req.url}`;

      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        headers: {
          'Content-Type': req.headers['content-type'],
          'Authorization': req.headers.authorization,
        },
        validateStatus: () => true, // Don't throw on HTTP error status
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({
        error: 'Utility service unavailable',
        message: error.message
      });
    }
  }
} 