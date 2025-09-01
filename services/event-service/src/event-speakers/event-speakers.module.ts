import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventSpeaker } from './entities/event-speaker.entity';
import { EventSpeakersController } from './event-speakers.controller';
import { EventSpeakersService } from './event-speakers.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventSpeaker])],
    controllers: [EventSpeakersController],
    providers: [EventSpeakersService],
    exports: [EventSpeakersService],
})
export class EventSpeakersModule { } 