import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTagMaster } from './entities/event-tag-master.entity';
import { EventTagMasterController } from './event-tag-master.controller';
import { EventTagMasterService } from './event-tag-master.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventTagMaster])],
    controllers: [EventTagMasterController],
    providers: [EventTagMasterService],
    exports: [EventTagMasterService],
})
export class EventTagMasterModule { } 