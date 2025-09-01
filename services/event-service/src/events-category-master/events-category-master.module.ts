import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsCategoryMaster } from './entities/events-category-master.entity';
import { EventsCategoryMasterController } from './events-category-master.controller';
import { EventsCategoryMasterService } from './events-category-master.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventsCategoryMaster])],
    controllers: [EventsCategoryMasterController],
    providers: [EventsCategoryMasterService],
    exports: [EventsCategoryMasterService],
})
export class EventsCategoryMasterModule { } 