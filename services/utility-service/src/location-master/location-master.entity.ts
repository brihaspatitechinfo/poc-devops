import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wit_location_master')
export class LocationMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  location: string;

  @Column({ name: 'countryId', nullable: true })
  countryId: number;

  @Column({ default: 0 })
  sort: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 