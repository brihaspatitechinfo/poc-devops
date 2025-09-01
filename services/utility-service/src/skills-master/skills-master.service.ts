import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateSkillsMasterDto } from './dto/create-skills-master.dto';
import { SkillsMasterResponseDto } from './dto/skills-master-response.dto';
import { UpdateSkillsMasterDto } from './dto/update-skills-master.dto';
import { SkillsMaster, SkillType } from './entities/skills-master.entity';

@Injectable()
export class SkillsMasterService {
    private readonly logger = new Logger(SkillsMasterService.name);

    constructor(
        @InjectRepository(SkillsMaster)
        private skillsMasterRepository: Repository<SkillsMaster>,
    ) { }

    async create(createSkillsMasterDto: CreateSkillsMasterDto): Promise<{ statusCode: number; message: string; }> {
        try {
            await this.skillsMasterRepository.save(this.skillsMasterRepository.create(createSkillsMasterDto));
            this.logger.log(`Created new skill: ${createSkillsMasterDto.skill}`);
            return { statusCode: HttpStatus.CREATED, message: 'Skill created successfully' };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Skill with this name and type already exists');
            }
            this.logger.error(`Failed to create skill: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create skill');
        }
    }

    async findAll(): Promise<SkillsMasterResponseDto[]> {
        try {
            const skills = await this.skillsMasterRepository.find({
                order: { sortOrder: 'ASC', createdAt: 'DESC' }
            });
            this.logger.log(`Retrieved ${skills.length} skills`);
            return skills.map(skill => this.mapToResponseDto(skill));
        } catch (error) {
            this.logger.error(`Error retrieving all skills: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve skills');
        }
    }

    async findOne(id: number): Promise<SkillsMasterResponseDto> {
        try {
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid skill ID provided');
            }

            const skill = await this.skillsMasterRepository.findOne({ where: { id } });
            if (!skill) {
                throw new NotFoundException(`Skill with ID ${id} not found`);
            }

            this.logger.log(`Retrieved skill with ID: ${id}`);
            return this.mapToResponseDto(skill);
        } catch (error) {
            this.logger.error(`Error retrieving skill with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to retrieve skill');
        }
    }

    async update(id: number, updateSkillsMasterDto: UpdateSkillsMasterDto): Promise<{ statusCode: number; message: string; }> {
        try {
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid skill ID provided');
            }

            const skill = await this.skillsMasterRepository.findOne({ where: { id } });
            if (!skill) {
                throw new NotFoundException(`Skill with ID ${id} not found`);
            }

            await this.skillsMasterRepository.update(id, updateSkillsMasterDto);
            this.logger.log(`Updated skill with ID: ${id}`);
            return { statusCode: HttpStatus.OK, message: 'Skill updated successfully' };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Skill with this name and type already exists');
            }
            this.logger.error(`Error updating skill with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update skill');
        }
    }

    async remove(id: number): Promise<{ statusCode: number; message: string; }> {
        try {
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid skill ID provided');
            }

            const skill = await this.skillsMasterRepository.findOne({ where: { id } });
            if (!skill) {
                throw new NotFoundException(`Skill with ID ${id} not found`);
            }

            await this.skillsMasterRepository.softDelete(id);
            this.logger.log(`Soft deleted skill with ID: ${id}`);
            return { statusCode: HttpStatus.OK, message: 'Skill deleted successfully' };
        } catch (error) {
            this.logger.error(`Error deleting skill with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete skill');
        }
    }

    private mapToResponseDto(skill: SkillsMaster): SkillsMasterResponseDto {
        return {
            id: skill.id,
            skill: skill.skill,
            type: skill.type,
            status: skill.status,
            sortOrder: skill.sortOrder,
            createdAt: skill.createdAt,
            updatedAt: skill.updatedAt,
            deletedAt: skill.deletedAt,
        };
    }

    async searchSkills(query: string): Promise<SkillsMasterResponseDto[]> {
        try {
            if (!query || query.trim().length === 0) {
                return this.findAll();
            }

            const skills = await this.skillsMasterRepository.find({
                where: [
                    { skill: Like(`%${query}%`) }
                ],
                order: { sortOrder: 'ASC', createdAt: 'DESC' }
            });

            this.logger.log(`Search for "${query}" returned ${skills.length} skills`);
            return skills.map(skill => this.mapToResponseDto(skill));
        } catch (error) {
            this.logger.error(`Error searching skills with query "${query}": ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to search skills');
        }
    }

    async getSkillsByCategory(category: string): Promise<SkillsMasterResponseDto[]> {
        try {
            if (!category || category.trim().length === 0) {
                return this.findAll();
            }

            const skills = await this.skillsMasterRepository.find({
                where: { type: category as SkillType },
                order: { sortOrder: 'ASC', createdAt: 'DESC' }
            });

            this.logger.log(`Retrieved ${skills.length} skills for category: ${category}`);
            return skills.map(skill => this.mapToResponseDto(skill));
        } catch (error) {
            this.logger.error(`Error retrieving skills for category "${category}": ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve skills by category');
        }
    }

    async getActiveSkills(): Promise<SkillsMasterResponseDto[]> {
        try {
            const skills = await this.skillsMasterRepository.find({
                where: { status: 1 },
                order: { sortOrder: 'ASC', createdAt: 'DESC' }
            });

            this.logger.log(`Retrieved ${skills.length} active skills`);
            return skills.map(skill => this.mapToResponseDto(skill));
        } catch (error) {
            this.logger.error(`Error retrieving active skills: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve active skills');
        }
    }
} 