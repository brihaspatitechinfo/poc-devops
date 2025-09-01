import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLocations } from './entities/event-locations.entity';
import { EventLocationsController } from './event-locations.controller';
import { EventLocationsService } from './event-locations.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventLocations])],
    controllers: [EventLocationsController],
    providers: [EventLocationsService],
    exports: [EventLocationsService],
})
export class EventLocationsModule { } 