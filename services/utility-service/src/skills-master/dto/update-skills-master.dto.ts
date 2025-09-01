import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { SkillType } from '../entities/skills-master.entity';

export class UpdateSkillsMasterDto {
    @ApiPropertyOptional({
        description: 'Skill name',
        example: 'JavaScript',
        maxLength: 255,
    })
    @IsOptional()
    @IsString({ message: 'Skill name must be a string' })
    @MinLength(1, { message: 'Skill name cannot be empty' })
    @MaxLength(255, { message: 'Skill name cannot exceed 255 characters' })
    skill?: string;

    @ApiPropertyOptional({
        description: 'Type of skill (TECH, SOFT, BUSINESS)',
        example: 'TECH',
        enum: SkillType,
    })
    @IsOptional()
    @IsEnum(SkillType, { message: 'Type must be one of: TECH, SOFT, BUSINESS' })
    type?: SkillType;

    @ApiPropertyOptional({
        description: 'Status of the skill (1 = active, 0 = inactive)',
        example: 1,
        minimum: 0,
        maximum: 1,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Status must be a number' })
    status?: number;

    @ApiPropertyOptional({
        description: 'Sort order for displaying skills',
        example: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Sort order must be a number' })
    @IsPositive({ message: 'Sort order must be a positive number' })
    sortOrder?: number;
} 