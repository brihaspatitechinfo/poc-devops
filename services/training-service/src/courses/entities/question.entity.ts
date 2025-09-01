import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'multiple_choice',
    comment: 'multiple_choice, true_false, text'
  })
  type: string;

  @Column('simple-array', { nullable: true })
  options: string[]; // for multiple choice questions

  @Column()
  correctAnswer: string;

  @Column({ default: 1 })
  points: number;

  @Column()
  order: number;

  @Column()
  assessmentId: string;

  @ManyToOne(() => Assessment, assessment => assessment.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;
} 