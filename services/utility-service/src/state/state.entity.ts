import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Country } from '../country/country.entity';
import { City } from '../city/city.entity';

@Entity('wit_states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'countryId' })
  countryId: number;

  @ManyToOne(() => Country, country => country.states)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToMany(() => City, city => city.state)
  cities: City[];
} 