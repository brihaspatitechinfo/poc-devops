import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import axios from 'axios';

@Injectable()
export class TrainingService {
  private readonly trainingServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.trainingServiceUrl = this.configService.get<string>('TRAINING_SERVICE_URL') || 'http://training-service:3006';
  }

  async proxyRequest(req: Request, res: Response) {
    try {
      const targetUrl = `${this.trainingServiceUrl}${req.url}`;
      
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
        error: 'Training service unavailable',
        message: error.message 
      });
    }
  }
}
