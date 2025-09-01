import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventTagRelationshipDto } from './dto/create-event-tag-relationship.dto';
import { UpdateEventTagRelationshipDto } from './dto/update-event-tag-relationship.dto';
import { EventTagRelationshipsController } from './event-tag-relationships.controller';
import { EventTagRelationshipsService } from './event-tag-relationships.service';

describe('EventTagRelationshipsController', () => {
    let controller: EventTagRelationshipsController;
    let service: EventTagRelationshipsService;

    const mockEventTagRelationshipsService = {
        create: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn(),
        findByEventId: jest.fn(),
        findByTagId: jest.fn(),
        findTagIdsByEventId: jest.fn(),
        findEventIdsByTagId: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeByEventId: jest.fn(),
        removeByTagId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventTagRelationshipsController],
            providers: [
                {
                    provide: EventTagRelationshipsService,
                    useValue: mockEventTagRelationshipsService,
                },
            ],
        }).compile();

        controller = module.get<EventTagRelationshipsController>(EventTagRelationshipsController);
        service = module.get<EventTagRelationshipsService>(EventTagRelationshipsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event tag relationship', async () => {
                  const createDto: CreateEventTagRelationshipDto = {
        eventId: 1,
        tagId: 5,
      };

      const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockEventTagRelationshipsService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResult);
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

            mockEventTagRelationshipsService.bulkCreate.mockResolvedValue(expectedResult);

            const result = await controller.bulkCreate(relationships);

            expect(service.bulkCreate).toHaveBeenCalledWith(relationships);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event tag relationships', async () => {
                  const expectedResult = [
        { id: 1, eventId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, eventId: 1, tagId: 10, createdAt: new Date(), updatedAt: new Date() },
      ];

            mockEventTagRelationshipsService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event tag relationships for a specific event', async () => {
            const eventId = 1;
                  const expectedResult = [
        { id: 1, eventId: eventId, tagId: 5, createdAt: new Date(), updatedAt: new Date() },
      ];

            mockEventTagRelationshipsService.findByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByTagId', () => {
        it('should return event tag relationships for a specific tag', async () => {
            const tagId = 5;
                  const expectedResult = [
        { id: 1, eventId: 1, tagId: tagId, createdAt: new Date(), updatedAt: new Date() },
      ];

            mockEventTagRelationshipsService.findByTagId.mockResolvedValue(expectedResult);

            const result = await controller.findByTagId(tagId);

            expect(service.findByTagId).toHaveBeenCalledWith(tagId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTagIdsByEventId', () => {
        it('should return tag IDs for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [5, 10];

            mockEventTagRelationshipsService.findTagIdsByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findTagIdsByEventId(eventId);

            expect(service.findTagIdsByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findEventIdsByTagId', () => {
        it('should return event IDs for a specific tag', async () => {
            const tagId = 5;
            const expectedResult = [1, 2];

            mockEventTagRelationshipsService.findEventIdsByTagId.mockResolvedValue(expectedResult);

            const result = await controller.findEventIdsByTagId(tagId);

            expect(service.findEventIdsByTagId).toHaveBeenCalledWith(tagId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event tag relationship', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, tagId: 5, createdAt: new Date(), updatedAt: new Date() };

            mockEventTagRelationshipsService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update an event tag relationship', async () => {
            const id = 1;
                  const updateDto: UpdateEventTagRelationshipDto = { tagId: 10 };
      const expectedResult = { id, eventId: 1, tagId: 10, createdAt: new Date(), updatedAt: new Date() };

            mockEventTagRelationshipsService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event tag relationship', async () => {
            const id = 1;

            mockEventTagRelationshipsService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('removeByEventId', () => {
        it('should remove all relationships for an event', async () => {
            const eventId = 1;

            mockEventTagRelationshipsService.removeByEventId.mockResolvedValue(undefined);

            await controller.removeByEventId(eventId);

            expect(service.removeByEventId).toHaveBeenCalledWith(eventId);
        });
    });

    describe('removeByTagId', () => {
        it('should remove all relationships for a tag', async () => {
            const tagId = 5;

            mockEventTagRelationshipsService.removeByTagId.mockResolvedValue(undefined);

            await controller.removeByTagId(tagId);

            expect(service.removeByTagId).toHaveBeenCalledWith(tagId);
        });
    });
}); 