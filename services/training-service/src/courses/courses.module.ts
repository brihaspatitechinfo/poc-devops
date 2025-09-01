import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Assessment } from './entities/assessment.entity';
import { Question } from './entities/question.entity';
import { Submission } from './entities/submission.entity';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Assessment, Question, Submission])],
  controllers: [CoursesController, AssessmentsController],
  providers: [CoursesService, AssessmentsService],
})
export class CoursesModule {}
