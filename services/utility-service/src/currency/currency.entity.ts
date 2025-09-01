import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wit_currency_master')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  currency: string;

  @Column({ length: 3 })
  code: string;

  @Column({ length: 5 })
  symbol: string;

  @Column({ default: 1 })
  status: number;

  @Column({ name: 'decimalDigits', nullable: true })
  decimalDigits: string;

  @Column({ name: 'sortOrder', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 