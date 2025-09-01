import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SsoService } from './sso.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, SsoService],
})
export class AuthModule {}
