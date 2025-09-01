import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngagementService } from './engagement.service';
import { EngagementController } from './engagement.controller';
import { Engagement } from './entities/engagement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Engagement]),
  ],
  controllers: [EngagementController],
  providers: [EngagementService],
  exports: [EngagementService],
})
export class EngagementModule {} 