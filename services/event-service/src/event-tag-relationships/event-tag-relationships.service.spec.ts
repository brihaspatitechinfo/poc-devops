import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventTagRelationshipDto } from './dto/create-event-tag-relationship.dto';
import { UpdateEventTagRelationshipDto } from './dto/update-event-tag-relationship.dto';
import { EventTagRelationship } from './entities/event-tag-relationship.entity';
import { EventTagRelationshipsService } from './event-tag-relationships.service';

describe('EventTagRelationshipsService', () => {
    let service: EventTagRelationshipsService;
    let repository: Repository<EventTagRelationship>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventTagRelationshipsService,
                {
                    provide: getRepositoryToken(EventTagRelationship),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventTagRelationshipsService>(EventTagRelationshipsService);
        repository = module.get<Repository<EventTagRelationship>>(getRepositoryToken(EventTagRelationship));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event tag relationship', async () => {
            const createDto: CreateEventTagRelationshipDto = {
                eventId: 1,
                tagId: 5,
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event tag relationships', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 1, tagId: 10, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event tag relationships for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, tagId: 5, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByEventId(eventId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { eventId: eventId }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByTagId', () => {
        it('should return event tag relationships for a specific tag', async () => {
            const tagId = 5;
            const expectedResult = [
                { id: 1, eventId: 1, tagId: tagId, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByTagId(tagId);

                  expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tagId: tagId }
      });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event tag relationship', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findOne(id);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when event tag relationship not found', async () => {
            const id = 999;

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an event tag relationship', async () => {
            const id = 1;
            const updateDto: UpdateEventTagRelationshipDto = { tagId: 10 };
            const existingRelationship = { id, eventId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() };
            const expectedResult = { ...existingRelationship, ...updateDto };

            mockRepository.findOne.mockResolvedValue(existingRelationship);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.update(id, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event tag relationship', async () => {
            const id = 1;
            const existingRelationship = { id, eventId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(existingRelationship);
            mockRepository.remove.mockResolvedValue(existingRelationship);

            await service.remove(id);

            expect(mockRepository.remove).toHaveBeenCalledWith(existingRelationship);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event tag relationships', async () => {
            const relationships: CreateEventTagRelationshipDto[] = [
                { eventId: 1, tagId: 5 },
                { eventId: 1, tagId: 10 },
            ];

            const expectedResult = [
                { id: 1, ...relationships[0], createdAt: new Date(), updatedAt: new Date() },
                { id: 2, ...relationships[1], createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.bulkCreate(relationships);

            expect(mockRepository.create).toHaveBeenCalledWith(relationships);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('removeByEventId', () => {
        it('should remove all relationships for an event', async () => {
            const eventId = 1;

            mockRepository.delete.mockResolvedValue({ affected: 2 });

            await service.removeByEventId(eventId);

            expect(mockRepository.delete).toHaveBeenCalledWith({ eventId: eventId });
        });
    });

    describe('removeByTagId', () => {
        it('should remove all relationships for a tag', async () => {
            const tagId = 5;

            mockRepository.delete.mockResolvedValue({ affected: 3 });

            await service.removeByTagId(tagId);

            expect(mockRepository.delete).toHaveBeenCalledWith({ tagId: tagId });
        });
    });

    describe('findEventIdsByTagId', () => {
        it('should return event IDs for a specific tag', async () => {
            const tagId = 5;
            const relationships = [
                { id: 1, eventId: 1, tagId: tagId, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 2, tagId: tagId, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(relationships);

            const result = await service.findEventIdsByTagId(tagId);

            expect(result).toEqual([1, 2]);
        });
    });

    describe('findTagIdsByEventId', () => {
        it('should return tag IDs for a specific event', async () => {
            const eventId = 1;
            const relationships = [
                { id: 1, eventId: eventId, tagId: 5, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: eventId, tagId: 10, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(relationships);

            const result = await service.findTagIdsByEventId(eventId);

            expect(result).toEqual([5, 10]);
        });
    });
}); 