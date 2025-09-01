import { Test, TestingModule } from '@nestjs/testing';
import { CreateSkillsMasterDto } from './dto/create-skills-master.dto';
import { SkillsMasterResponseDto } from './dto/skills-master-response.dto';
import { UpdateSkillsMasterDto } from './dto/update-skills-master.dto';
import { SkillsMasterController } from './skills-master.controller';
import { SkillsMasterService } from './skills-master.service';
import { SkillType } from './entities/skills-master.entity';

describe('SkillsMasterController', () => {
    let controller: SkillsMasterController;
    let service: SkillsMasterService;

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SkillsMasterController],
            providers: [
                {
                    provide: SkillsMasterService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<SkillsMasterController>(SkillsMasterController);
        service = module.get<SkillsMasterService>(SkillsMasterService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new skill', async () => {
            const createDto: CreateSkillsMasterDto = {
                skill: 'JavaScript',
                type: SkillType.TECH,   
                status: 1,
                sortOrder: 0,
            };

            const expectedResult = { statusCode: 201, message: 'Skill created successfully' };
            mockService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(result).toEqual(expectedResult);
            expect(mockService.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe('findAll', () => {
        it('should return all skills', async () => {
            const mockSkills: SkillsMasterResponseDto[] = [
                {
                    id: 1,
                    skill: 'JavaScript',
                    type: SkillType.TECH,
                    status: 1,
                    sortOrder: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    skill: 'Communication',
                    type: SkillType.SOFT,
                    status: 1,
                    sortOrder: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockService.findAll.mockResolvedValue(mockSkills);

            const result = await controller.findAll();

            expect(result).toEqual(mockSkills);
            expect(mockService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a skill by id', async () => {
            const mockSkill: SkillsMasterResponseDto = {
                id: 1,
                skill: 'JavaScript',
                type: SkillType.TECH,
                status: 1,
                sortOrder: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockService.findOne.mockResolvedValue(mockSkill);

            const result = await controller.findOne(1);

            expect(result).toEqual(mockSkill);
            expect(mockService.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update a skill', async () => {
            const updateDto: UpdateSkillsMasterDto = {
                skill: 'Updated JavaScript',
                sortOrder: 5,
            };

            const expectedResult = { statusCode: 200, message: 'Skill updated successfully' };
            mockService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(1, updateDto);

            expect(result).toEqual(expectedResult);
            expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('remove', () => {
        it('should remove a skill', async () => {
            const expectedResult = { statusCode: 200, message: 'Skill deleted successfully' };
            mockService.remove.mockResolvedValue(expectedResult);

            const result = await controller.remove(1);

            expect(result).toEqual(expectedResult);
            expect(mockService.remove).toHaveBeenCalledWith(1);
        });
    });
}); 