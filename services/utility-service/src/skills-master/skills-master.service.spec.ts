import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillsMasterDto } from './dto/create-skills-master.dto';
import { UpdateSkillsMasterDto } from './dto/update-skills-master.dto';
import { SkillsMaster, SkillType } from './entities/skills-master.entity';
import { SkillsMasterService } from './skills-master.service';

describe('SkillsMasterService', () => {
    let service: SkillsMasterService;
    let repository: Repository<SkillsMaster>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SkillsMasterService,
                {
                    provide: getRepositoryToken(SkillsMaster),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<SkillsMasterService>(SkillsMasterService);
        repository = module.get<Repository<SkillsMaster>>(getRepositoryToken(SkillsMaster));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new skill', async () => {
            const createDto: CreateSkillsMasterDto = {
                skill: 'JavaScript',
                type: SkillType.TECH,
                status: 1,
                sortOrder: 0,
            };

            const mockSkill = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };
            mockRepository.create.mockReturnValue(mockSkill);
            mockRepository.save.mockResolvedValue(mockSkill);

            const result = await service.create(createDto);

            expect(result.statusCode).toBe(201);
            expect(result.message).toBe('Skill created successfully');
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockSkill);
        });

        it('should handle duplicate entry error', async () => {
            const createDto: CreateSkillsMasterDto = {
                skill: 'JavaScript',
                type: SkillType.TECH,
            };

            const error = new Error('Duplicate entry');
            error['code'] = 'ER_DUP_ENTRY';
            mockRepository.save.mockRejectedValue(error);

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all skills', async () => {
            const mockSkills = [
                { id: 1, skill: 'JavaScript', type: SkillType.TECH, status: 1, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, skill: 'Communication', type: SkillType.SOFT, status: 1, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(mockSkills);

            const result = await service.findAll();

            expect(result).toHaveLength(2);
            expect(mockRepository.find).toHaveBeenCalledWith({
                order: { sortOrder: 'ASC', createdAt: 'DESC' }
            });
        });
    });

    describe('findOne', () => {
        it('should return a skill by id', async () => {
            const mockSkill = { id: 1, skill: 'JavaScript', type: SkillType.TECH, status: 1, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() };
            mockRepository.findOne.mockResolvedValue(mockSkill);

            const result = await service.findOne(1);

            expect(result.id).toBe(1);
            expect(result.skill).toBe('JavaScript');
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException when skill not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for invalid id', async () => {
            await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
            await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update a skill', async () => {
            const updateDto: UpdateSkillsMasterDto = {
                skill: 'Updated JavaScript',
                sortOrder: 5,
            };

            const existingSkill = { id: 1, skill: 'JavaScript', type: SkillType.TECH, status: 1, sortOrder: 0 };
            mockRepository.findOne.mockResolvedValue(existingSkill);
            mockRepository.update.mockResolvedValue({ affected: 1 });

            const result = await service.update(1, updateDto);

            expect(result.statusCode).toBe(200);
            expect(result.message).toBe('Skill updated successfully');
            expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('should throw NotFoundException when skill not found', async () => {
            const updateDto: UpdateSkillsMasterDto = { skill: 'Updated JavaScript' };
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should soft delete a skill', async () => {
            const existingSkill = { id: 1, skill: 'JavaScript', type: SkillType.TECH, status: 1, sortOrder: 0 };
            mockRepository.findOne.mockResolvedValue(existingSkill);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            const result = await service.remove(1);

            expect(result.statusCode).toBe(200);
            expect(result.message).toBe('Skill deleted successfully');
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException when skill not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
}); 