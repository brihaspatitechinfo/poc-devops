import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { State } from '../state/state.entity';

@Entity('wit_countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3, unique: true })
  shortname: string;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'dialCode', default: 0 })
  dialCode: number;

  @Column({ default: 1 })
  status: number;

  @OneToMany(() => State, state => state.country)
  states: State[];
} 