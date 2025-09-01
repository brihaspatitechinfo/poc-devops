import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimezoneController } from './timezone.controller';
import { TimezoneService } from './timezone.service';
import { TimezoneMaster } from './timezone-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimezoneMaster])],
  controllers: [TimezoneController],
  providers: [TimezoneService],
  exports: [TimezoneService],
})
export class TimezoneModule {} 