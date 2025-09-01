import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('wit_select_corporate_unlimited_prices')
  export class WitSelectCorporateUnlimitedPrices {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
  
    @Column({ type: 'varchar', length: 64 })
    corporateId: string;
  
    @Column({ type: 'int' })
    month: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  } 