import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CohortService } from './cohort.service';
import { CohortController } from './cohort.controller';
import { WitSelectCohort } from './entities/wit-select-cohort.entity';
import { Interaction } from './entities/wit-select-cohort-interactions.entity';
import { CohortFeedbackFrequency } from './entities/cohort-feedback-frequency.entity';
import { MenteeEnrollmentTable } from './entities/mentee-enrollment.entity';
 
 
@Module({
  imports: [
    TypeOrmModule.forFeature([
      WitSelectCohort,
      Interaction,
      CohortFeedbackFrequency,
      MenteeEnrollmentTable,
     
    ]),
    HttpModule,
  ],
  controllers: [
    CohortController,
   
  ],
  providers: [
    CohortService,
  ],
  exports: [
    CohortService,
  
  ],
})
export class CohortModule {} 