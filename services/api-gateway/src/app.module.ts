import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoachingModule } from './modules/coaching/coaching.module';
import { TrainingModule } from './modules/training/training.module';
import { EventsModule } from './modules/events/events.module';
import { EngagementModule } from './modules/engagement/engagement.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { UtilityModule } from './modules/utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100
    }]),
    AuthModule,
    UsersModule,
    CoachingModule,
    TrainingModule,
    EventsModule,
    EngagementModule,
    NotificationsModule,
    HealthModule,
    UtilityModule,
  ],
})
export class AppModule {}
