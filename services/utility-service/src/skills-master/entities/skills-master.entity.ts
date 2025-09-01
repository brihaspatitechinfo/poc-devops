import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum SkillType {
    TECH = 'TECH',
    SOFT = 'SOFT',
    BUSINESS = 'BUSINESS'
}

@Entity('wit_skills_master')
export class SkillsMaster {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        charset: 'utf8mb4',
        collation: 'utf8mb4_0900_ai_ci',
        comment: 'Skill name',
    })
    skill: string;

    @Column({ type: 'enum', enum: SkillType, nullable: true, comment: 'Type of skill (TECH, SOFT, BUSINESS)' })
    type: SkillType;

    @Column({
        type: 'tinyint',
        unsigned: true,
        default: 1,
        comment: 'Status of the skill (1 = active, 0 = inactive)',
    })
    status: number;

    @Column({
        type: 'smallint',
        unsigned: true,
        default: 0,
        comment: 'Sort order for displaying skills',
    })
    sortOrder: number;

    @CreateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        comment: 'Record creation timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        precision: 0,
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        comment: 'Record update timestamp',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        precision: 0,
        nullable: true,
        comment: 'Soft delete timestamp',
    })
    deletedAt: Date;
}
