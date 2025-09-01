import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('wit_event_teams')
export class EventTeam {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: false })
    teamId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    teamName: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    displayImage: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    videoLink: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    documentLink: string;

    @Column({ type: 'text', nullable: true })
    videoCaption: string;

    @Column({ type: 'text', nullable: true })
    ideaCaption: string;

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