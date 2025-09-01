import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Question } from './question.entity';
import { Submission } from './submission.entity';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  createdBy: string; // instructor/trainer ID

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'technical',
    comment: 'technical, business, personal'
  })
  category: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'beginner',
    comment: 'beginner, intermediate, advanced'
  })
  difficulty: string;

  @Column({ default: 30 })
  duration: number; // in minutes

  @Column({ default: 70 })
  passingScore: number; // percentage

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Question, question => question.assessment, { cascade: true })
  questions: Question[];

  @OneToMany(() => Submission, submission => submission.assessment)
  submissions: Submission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 