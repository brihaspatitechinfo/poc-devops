import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventTagMasterDto } from './dto/create-event-tag-master.dto';
import { UpdateEventTagMasterDto } from './dto/update-event-tag-master.dto';
import { EventTagMaster } from './entities/event-tag-master.entity';
import { EventTagMasterService } from './event-tag-master.service';

describe('EventTagMasterService', () => {
    let service: EventTagMasterService;
    let repository: Repository<EventTagMaster>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventTagMasterService,
                {
                    provide: getRepositoryToken(EventTagMaster),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventTagMasterService>(EventTagMasterService);
        repository = module.get<Repository<EventTagMaster>>(getRepositoryToken(EventTagMaster));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event tag master', async () => {
            const createDto: CreateEventTagMasterDto = {
                tag: 'Technology',
                isPreferred: 0,
            };

            const mockEventTagMaster = {
                id: 1,
                ...createDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockEventTagMaster);
            mockRepository.save.mockResolvedValue(mockEventTagMaster);

            const result = await service.create(createDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { tag: createDto.tag },
            });
            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(mockEventTagMaster);
            expect(result).toEqual(mockEventTagMaster);
        });

        it('should throw ConflictException if tag already exists', async () => {
            const createDto: CreateEventTagMasterDto = {
                tag: 'Technology',
                isPreferred: 0,
            };

            const existingTag = {
                id: 1,
                tag: 'Technology',
                isPreferred: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(existingTag);

            await expect(service.create(createDto)).rejects.toThrow(
                new ConflictException("Tag 'Technology' already exists"),
            );
        });
    });

    describe('findAll', () => {
        it('should return paginated list of event tag masters', async () => {
            const mockData = [
                {
                    id: 1,
                    tag: 'Technology',
                    isPreferred: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([mockData, 1]),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findAll(1, 10);

            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('eventTagMaster');
            expect(result).toEqual({
                data: mockData,
                total: 1,
                page: 1,
                limit: 10,
            });
        });

        it('should filter by tag when provided', async () => {
            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(1, 10, 'Tech');

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                'eventTagMaster.tag LIKE :tag',
                { tag: '%Tech%' },
            );
        });

        it('should filter by isPreferred when provided', async () => {
            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(1, 10, undefined, true);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                'eventTagMaster.isPreferred = :isPreferred',
                { isPreferred: true },
            );
        });
    });

    describe('findOne', () => {
        it('should return event tag master by id', async () => {
            const mockEventTagMaster = {
                id: 1,
                tag: 'Technology',
                isPreferred: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(mockEventTagMaster);

            const result = await service.findOne(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(result).toEqual(mockEventTagMaster);
        });

        it('should throw NotFoundException if event tag master not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(
                new NotFoundException('Event tag master with ID 999 not found'),
            );
        });
    });

    describe('findByTag', () => {
        it('should return event tag masters by tag', async () => {
            const mockData = [
                {
                    id: 1,
                    tag: 'Technology',
                    isPreferred: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findByTag('Tech');

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { tag: expect.any(Object) },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('findPreferred', () => {
        it('should return preferred event tag masters', async () => {
            const mockData = [
                {
                    id: 1,
                    tag: 'Technology',
                    isPreferred: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockRepository.find.mockResolvedValue(mockData);

            const result = await service.findPreferred();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { isPreferred: true },
                order: { createdAt: 'DESC' },
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('update', () => {
        it('should update event tag master', async () => {
            const updateDto: UpdateEventTagMasterDto = {
                tag: 'Updated Technology',
                isPreferred: 1,
            };

            const existingEventTagMaster = {
                id: 1,
                tag: 'Technology',
                isPreferred: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedEventTagMaster = {
                ...existingEventTagMaster,
                ...updateDto,
            };

            mockRepository.findOne
                .mockResolvedValueOnce(existingEventTagMaster) // for findOne
                .mockResolvedValueOnce(null); // for duplicate check
            mockRepository.save.mockResolvedValue(updatedEventTagMaster);

            const result = await service.update(1, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(updatedEventTagMaster);
            expect(result).toEqual(updatedEventTagMaster);
        });

        it('should throw ConflictException if updated tag already exists', async () => {
            const updateDto: UpdateEventTagMasterDto = {
                tag: 'New Tag',
            };

            const existingEventTagMaster = {
                id: 1,
                tag: 'Technology',
                isPreferred: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const duplicateTag = {
                id: 2,
                tag: 'New Tag',
                isPreferred: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne
                .mockResolvedValueOnce(existingEventTagMaster) // for findOne
                .mockResolvedValueOnce(duplicateTag); // for duplicate check

            await expect(service.update(1, updateDto)).rejects.toThrow(
                new ConflictException("Tag 'New Tag' already exists"),
            );
        });
    });

    describe('remove', () => {
        it('should remove event tag master', async () => {
            const mockEventTagMaster = {
                id: 1,
                tag: 'Technology',
                isPreferred: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(mockEventTagMaster);
            mockRepository.remove.mockResolvedValue(mockEventTagMaster);

            await service.remove(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(mockRepository.remove).toHaveBeenCalledWith(mockEventTagMaster);
        });
    });

    describe('togglePreferred', () => {
        it('should toggle preferred status', async () => {
            const mockEventTagMaster = {
                id: 1,
                tag: 'Technology',
                isPreferred: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const toggledEventTagMaster = {
                ...mockEventTagMaster,
                isPreferred: true,
            };

            mockRepository.findOne.mockResolvedValue(mockEventTagMaster);
            mockRepository.save.mockResolvedValue(toggledEventTagMaster);

            const result = await service.togglePreferred(1);

            expect(mockRepository.save).toHaveBeenCalledWith(toggledEventTagMaster);
            expect(result.isPreferred).toBe(true);
        });
    });
}); 