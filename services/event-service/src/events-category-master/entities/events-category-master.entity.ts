import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wit_events_category_master')
export class EventsCategoryMaster {
    @PrimaryGeneratedColumn({ type: 'smallint', unsigned: true })
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        charset: 'utf8mb4',
        collation: 'utf8mb4_0900_ai_ci'
    })
    name: string;

    @Column({ type: 'int', nullable: false })
    sortOrder: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;
} 