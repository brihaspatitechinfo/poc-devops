import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { WitSelectCohort } from './wit-select-cohort.entity';

@Entity('wit_select_interactions')
export class Interaction {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  cohortId: number;

  @Column({ type: 'bigint' })
  userId: number; // who created the cohort

  @Column({ length: 255 })
  title: string; // "Interaction 1", "Interaction 2", etc.

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0=pending, 1=confirmed, 2=completed, 3=cancelled

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => WitSelectCohort, (cohort) => cohort.interactions)
  @JoinColumn({ name: 'cohort_id' })
  cohort: WitSelectCohort;
} 