import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WitSelectCohort } from './wit-select-cohort.entity';

@Entity('cohort_feedback_frequencies')
export class CohortFeedbackFrequency {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  cohortId: number;

  @Column({ type: 'int' })
  frequency: number; // Total number of feedback sessions required

  @Column({ type: 'json', nullable: true })
  metadata: string[]; // Array of session numbers where feedback is required, e.g. ["1","3","4"]

  // Relationships
  @ManyToOne(() => WitSelectCohort, (cohort) => cohort.feedbackFrequencies)
  @JoinColumn({ name: 'cohort_id' })
  cohort: WitSelectCohort;
} 