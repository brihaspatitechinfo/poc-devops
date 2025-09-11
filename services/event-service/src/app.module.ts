import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventCouponsModule } from './event-coupons/event-coupons.module';
import { EventLocationsModule } from './event-locations/event-locations.module';
import { EventPhotoGalleryModule } from './event-photo-gallery/event-photo-gallery.module';
import { EventPricesModule } from './event-prices/event-prices.module';
import { EventQuestionAnswersModule } from './event-question-answers/event-question-answers.module';
import { EventQuestionsModule } from './event-questions/event-questions.module';
import { EventSpeakersModule } from './event-speakers/event-speakers.module';
import { EventTagMasterModule } from './event-tag-master/event-tag-master.module';
import { EventTagRelationshipsModule } from './event-tag-relationships/event-tag-relationships.module';
import { EventTeamsModule } from './event-teams/event-teams.module';
import { EventsCategoryMasterModule } from './events-category-master/events-category-master.module';
import { EventsCategoryModule } from './events-category/events-category.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '54.221.52.72',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'Admin@123',
      database: process.env.DB_NAME || 'weace_event',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
      timezone: 'Z',
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    }),
    EventsModule,
    EventsCategoryMasterModule,
    EventsCategoryModule,
    EventPhotoGalleryModule,
    EventTagMasterModule,
    EventLocationsModule,
    EventPricesModule,
    EventTeamsModule,
    EventCouponsModule,
    EventSpeakersModule,
    EventQuestionsModule,
    EventQuestionAnswersModule,
    EventTagRelationshipsModule,
    HealthModule,
    PermissionsModule,
  ],
})
export class AppModule { }
