import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventQuestion } from './entities/event-question.entity';
import { EventQuestionsController } from './event-questions.controller';
import { EventQuestionsService } from './event-questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventQuestion])],
    controllers: [EventQuestionsController],
    providers: [EventQuestionsService],
    exports: [EventQuestionsService],
})
export class EventQuestionsModule { } 