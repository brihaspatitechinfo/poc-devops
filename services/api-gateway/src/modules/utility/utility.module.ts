import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';

@Module({
  imports: [ConfigModule],
  controllers: [UtilityController],
  providers: [UtilityService],
})
export class UtilityModule {} 