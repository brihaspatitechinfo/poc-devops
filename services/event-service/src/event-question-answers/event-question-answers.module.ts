import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventQuestionAnswer } from './entities/event-question-answer.entity';
import { EventQuestionAnswersController } from './event-question-answers.controller';
import { EventQuestionAnswersService } from './event-question-answers.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventQuestionAnswer])],
    controllers: [EventQuestionAnswersController],
    providers: [EventQuestionAnswersService],
    exports: [EventQuestionAnswersService],
})
export class EventQuestionAnswersModule { } 