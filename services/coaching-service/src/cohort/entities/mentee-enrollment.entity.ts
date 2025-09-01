import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mentee_enrollment_table')
export class MenteeEnrollmentTable {
  @PrimaryGeneratedColumn('uuid')
  id: string; // unique id

  @Column({ type: 'bigint' })
  cohort_id: number;

  @Column({ type: 'varchar' })
  mentee_id: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0 = not_enrolled, 1 = Enrolled

  @Column({ type: 'varchar', length: 100, nullable: true })
  group: string;

  @Column({ type: 'tinyint', default: 2 })
  opt_for_chemistry_session: number; // 1 = yes, 2 = no

  @CreateDateColumn({ type: 'timestamp' })
  enrollment_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  coaching_cancelled_at: Date;

  @Column({ type: 'bigint', nullable: true })
  assign_by: number;
} 