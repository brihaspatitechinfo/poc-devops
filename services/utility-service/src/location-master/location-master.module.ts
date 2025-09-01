import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationMasterController } from './location-master.controller';
import { LocationMasterService } from './location-master.service';
import { LocationMaster } from './location-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationMaster])],
  controllers: [LocationMasterController],
  providers: [LocationMasterService],
  exports: [LocationMasterService],
})
export class LocationMasterModule {} 