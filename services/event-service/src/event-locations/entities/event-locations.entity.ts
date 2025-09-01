import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity('wit_event_locations')
@Unique(['eventId' , 'countryId' , 'stateId' , 'cityId'])
export class EventLocations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' , nullable: false })
    eventId: number;

    @Column({ type: 'int', nullable: true })
    countryId: number;

    @Column({ type: 'int', nullable: true })
    stateId: number;

    @Column({ type: 'int', nullable: true })
    cityId: number;

    @Column({ type: 'int', nullable: true })
    locationId: number;

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