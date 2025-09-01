import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Interaction } from './wit-select-cohort-interactions.entity';
import { CohortFeedbackFrequency } from './cohort-feedback-frequency.entity';

@Entity('wit_select_cohort')
export class WitSelectCohort {
  @PrimaryGeneratedColumn({ type: 'bigint' }) 
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'tinyint', default: 0 })
  isInternal: boolean;

  @Column({ type: 'bigint', nullable: true })
  organizationId: number | null;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'smallint' })
  timezoneId: number;

  @Column()
  duration: number;

  @Column({ type: 'json' })
  sessionDurations: any;      // 15,30,45,60,90,120

  @Column()
  allowedMentees: number;   //users how many we want

  @Column({ type: 'tinyint' })
  mentoringType: number;        // 1 to one-to-one and 2 for group

  @Column({ nullable: true })
  groupSize: number;   //if mentoring type is group then this will be the size of the group

  @Column({ type: 'text' })
  price: string;

  @Column({ type: 'tinyint' })
  noOfInteractions: number;      // 

  @Column({ type: 'tinyint' })
  status: number;               // 0=inactive,1=active,2=started,3=completed 

  @Column({ type: 'tinyint' })
  groupCreated: number;

  @Column({ type: 'tinyint' })
  mentorsMatched: number;

  @Column({ type: 'tinyint' })
  creationStatus: number;     // 1 for manual 2 for automated

  @Column({ type: 'tinyint' })
  cohortType: number; // 1 for Coaching to the company 2 for mentoring

  @Column({ type: 'tinyint' })
  assignCoachType: number; // 1 for internal to the company 0 for external

  @Column({ type: 'tinyint' })
  searchOption: number; // 1 for Automatic through Algorithm, 0 for Offline Matches

  @Column()
  minPrice: number;

  @Column()
  maxPrice: number;

  @Column({ type: 'tinyint' })
  isFfMandatory: number;

  @Column({ type: 'tinyint' })
  isUnlimited: number;

  @Column()
  chemistrySessionCount: number;  
  // is this like add in number that we write 
  // if chemistrysessionstatus will 1 means active 0 means inactive so here set chemistrysessioncount 
//if 1 than chemistrysessionCount will set as chemistrysessionCount per allowedmentees
 
  @Column()
  chemistrySessionStatus: number;

  @Column({ type: 'tinyint' })
  month: number;

  @Column({ type: 'bigint' })
  createdBy: number;

  @Column({ type: 'bigint' })
  updatedBy: number;

  @Column({ type: 'timestamp', nullable: true })
  coachingCancelledAt: Date;

  @Column({ length: 255, nullable: true })
  corporateName: string;

  @Column({ nullable: true })
  coachMentorType: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerSession: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @Column({ nullable: true })
  sessionDurationMinutes: number;

  @Column({ length: 255, nullable: true })
  createdByName: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Interaction, (interaction) => interaction.cohort)
  interactions: Interaction[];

  @OneToMany(() => CohortFeedbackFrequency, (frequency) => frequency.cohort)
  feedbackFrequencies: CohortFeedbackFrequency[];
} 