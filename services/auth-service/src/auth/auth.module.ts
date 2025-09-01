import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CognitoConfig } from './cognito.config';
import { CognitoService } from './cognito.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, CognitoConfig, CognitoService],
  exports: [AuthService],
})
export class AuthModule {}
