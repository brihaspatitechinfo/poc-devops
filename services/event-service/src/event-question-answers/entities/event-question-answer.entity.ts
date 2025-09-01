import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('wit_event_question_answers')
export class EventQuestionAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    eventId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    qKey: string;

    @Column({ type: 'int', nullable: false })
    eventQuestionId: number;

    @Column({ type: 'int', nullable: false })
    candidateId: number;

    @Column({ type: 'text', nullable: false })
    answer: string;

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