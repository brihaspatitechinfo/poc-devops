import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventPricesModule } from '../event-prices/event-prices.module';
import { FileModule } from '../file/file.module';
import { EventsCategoryModule } from '../events-category/events-category.module';
import { EventPhotoGalleryModule } from '../event-photo-gallery/event-photo-gallery.module';
import { EventLocationsModule } from '../event-locations/event-locations.module';
import { EventQuestionsModule } from '../event-questions/event-questions.module';
import { EventSpeakersModule } from '../event-speakers/event-speakers.module';
import { EventTagRelationshipsModule } from '../event-tag-relationships/event-tag-relationships.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), EventPricesModule, FileModule, EventsCategoryModule, EventPhotoGalleryModule, EventLocationsModule, EventQuestionsModule, EventSpeakersModule , EventTagRelationshipsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule { }
