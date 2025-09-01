import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('wit_event_tag_relationship')
export class EventTagRelationship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({  type: 'int', nullable: false })
    eventId: number;

    @Column({ type: 'int', nullable: false })
    tagId: number;

    @CreateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;
} 