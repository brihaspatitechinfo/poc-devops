import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillType } from '../entities/skills-master.entity';

export class SkillsMasterResponseDto {
    @ApiProperty({
        description: 'Unique identifier for the skill',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Skill name',
        example: 'JavaScript',
    })
    skill: string;

    @ApiPropertyOptional({
        description: 'Type of skill (TECH, SOFT, BUSINESS)',
        example: 'TECH',
        enum: SkillType,
    })
    type?: SkillType;

    @ApiProperty({
        description: 'Status of the skill (1 = active, 0 = inactive)',
        example: 1,
    })
    status: number;

    @ApiProperty({
        description: 'Sort order for displaying skills',
        example: 0,
    })
    sortOrder: number;

    @ApiProperty({
        description: 'Record creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Record update timestamp',
        example: '2024-01-01T00:00:00.000Z',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Soft delete timestamp',
        example: null,
    })
    deletedAt?: Date;
} 