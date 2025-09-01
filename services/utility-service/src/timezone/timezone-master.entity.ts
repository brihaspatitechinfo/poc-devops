// wit_timezone_master
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimezoneMeta } from '../timezone-meta/entities/timezone-meta.entity';

@Entity('wit_timezone_master')
export class TimezoneMaster {
  // @PrimaryGeneratedColumn('increment', { unsigned: true, type: 'tinyint' }) // match existing DB schema
  // id: number;
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezoneValue: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezoneAbbr: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezoneOffset: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  isdst: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezoneText: string;

  @OneToMany(() => TimezoneMeta, timezoneMeta => timezoneMeta.timezone)
  timezoneMeta: TimezoneMeta[];
}
