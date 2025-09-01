import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    eventId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    metaTitle?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    eventGuid?: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    url?: string;

    @Column({ type: 'text', nullable: false })
    shortDescription: string;

    @Column({ type: 'text', nullable: true })
    metaDescription?: string;

    @Column({
        type: 'enum',
        enum: [0, 1, 2],
        default: 0,
        comment: '0=>Virtual, 1=> offline, 2=>others'
    })
    type: number;

    @Column({ type: 'int', nullable: false, default: 75 })
    timezoneId: number;

    @Column({ type: 'datetime', nullable: true })
    startDate?: Date;

    @Column({ type: 'datetime', nullable: true })
    endDate?: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    contact?: string;

    @Column({ type: 'boolean', nullable: true })
    isPaid?: boolean;

    @Column({ type: 'boolean', nullable: true })
    isFeatured?: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price?: number;

    @Column({ type: 'varchar', length: 10, nullable: false, default: 'INR' })
    currency: string;

    @Column({
        type: 'boolean',
        nullable: false,
        comment: 'if enabled contact and email will be hidden'
    })
    isRedact: boolean;

    @Column({ type: 'int', nullable: true })
    dialCodeId?: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ type: 'longtext', nullable: false })
    detailedDescription: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    listImage?: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    liveEventUrl?: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    recordingUrl?: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        default: 'Please answer a few questions to complete your registration'
    })
    questionnaireLabel: string;

    @Column({ type: 'boolean', default: false })
    isMarquee: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    marqueeView?: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    detailUrl?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    contributionLabel?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    createdBy?: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

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

    // @DeleteDateColumn({ type: 'timestamp' })
    // deletedAt?: Date;
} 