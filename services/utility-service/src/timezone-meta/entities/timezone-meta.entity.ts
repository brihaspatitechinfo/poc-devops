// wit_timezone_meta
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimezoneMaster } from '../../timezone/timezone-master.entity';

@Entity('wit_timezone_meta')
export class TimezoneMeta {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'int',
    })
    timezoneId: number;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Timezone metadata in JSON format'
    })
    timezoneMeta: string;

    @ManyToOne(() => TimezoneMaster, timezone => timezone.timezoneMeta)
    @JoinColumn({ name: 'timezoneId', referencedColumnName: 'id' })
    timezone: TimezoneMaster;
}
