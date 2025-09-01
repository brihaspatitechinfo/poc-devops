import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @All('*')
  @All()
  async proxyToUserServicePath(@Req() req: Request, @Res() res: Response) {
    console.log('Proxying request to path:' + req.url);
    return this.usersService.proxyRequest(req, res);
  }
}

