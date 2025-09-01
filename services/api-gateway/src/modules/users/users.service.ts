import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';

@Injectable()
export class UsersService {
  private readonly userServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://user-service:3002';
  }

  async proxyRequest(req: Request, res: Response) {
    try {

      const targetUrl = `${this.userServiceUrl}${req.url}`;
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.body,
        params: req.query,
        headers: {
          'Content-Type': req.headers['content-type'],
          'Authorization': req.headers.authorization,
          'x-user-id': (req as any)?.user?.userId,
        },
        validateStatus: () => true,
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({
        error: 'User service unavailable',
        message: error.message
      });
    }
  }
}