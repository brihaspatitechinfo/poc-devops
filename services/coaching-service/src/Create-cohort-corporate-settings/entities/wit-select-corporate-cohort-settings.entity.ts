import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('wit_select_corporate_cohort_settings')
  export class WitSelectCorporateCohortSettings {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
  
    @Column()
    corporateId: string;
  
    @Column({ type: 'int' })
    cohortCount: number;
  
    @Column({ type: 'int' })
    allowedMentee: number;
  
    @Column({ type: 'int' })
    noIntraction: number;
  
    @Column({ type: 'json', nullable: false })
    cohortType: number[];
  
    @Column({ type: 'json', nullable: false })
    coachSearchType: number[];     //1 for internal 0 for external 
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    coachMaxPrice: number;
  
    @Column({ type: 'tinyint', default: 0 })
    isUnlimited: number; 
  
    @Column({ type: 'tinyint', default: 0 })
    enableDuration: number;
  
    @Column({ type: 'json', nullable: true })
    sessionDurationKeys: number[];
  
    @Column({ type: 'tinyint', default: 1 })
    status: number; // 1=active, 0=inactive
  
    @Column({ type: 'int', nullable: true })
    chemistrySessionCount: number;
  
    @Column({ type: 'tinyint', default: 0 })
    chemistrySessionStatus: number; // 1=active, 0=inactive
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  } 