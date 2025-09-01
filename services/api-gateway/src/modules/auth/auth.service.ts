import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      const targetUrl = `${this.authServiceUrl}${req.url}`;

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
        error: 'Auth service unavailable',
        message: error.message
      });
    }
  }
}


