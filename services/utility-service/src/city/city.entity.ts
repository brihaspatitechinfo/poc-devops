import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { State } from '../state/state.entity';

@Entity('wit_cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'stateId' })
  stateId: number;

  @Column({ name: 'countryId', nullable: true })
  countryId: number;

  @ManyToOne(() => State, state => state.cities)
  @JoinColumn({ name: 'stateId' })
  state: State;
} 