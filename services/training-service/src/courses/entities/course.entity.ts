import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  instructorId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  duration: number; // in hours

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'beginner',
    comment: 'beginner, intermediate, advanced'
  })
  level: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'technical',
    comment: 'technical, business, personal'
  })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  enrollmentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
