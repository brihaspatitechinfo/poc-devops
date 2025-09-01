import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assessmentId: string;

  @Column()
  userId: string;

  @Column('simple-json')
  answers: { [questionId: string]: string };

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  percentage: number;

  @Column({ default: false })
  passed: boolean;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => Assessment, assessment => assessment.submissions)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @CreateDateColumn()
  submittedAt: Date;
} 