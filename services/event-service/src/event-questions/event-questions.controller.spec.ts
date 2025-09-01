import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventQuestionDto } from './dto/create-event-question.dto';
import { UpdateEventQuestionDto } from './dto/update-event-question.dto';
import { EventQuestionsController } from './event-questions.controller';
import { EventQuestionsService } from './event-questions.service';

describe('EventQuestionsController', () => {
    let controller: EventQuestionsController;
    let service: EventQuestionsService;

    const mockEventQuestionsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByEventId: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventQuestionsController],
            providers: [
                {
                    provide: EventQuestionsService,
                    useValue: mockEventQuestionsService,
                },
            ],
        }).compile();

        controller = module.get<EventQuestionsController>(EventQuestionsController);
        service = module.get<EventQuestionsService>(EventQuestionsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event question', async () => {
            const createDto: CreateEventQuestionDto = {
                eventId: 1,
                qKey: 'test_key',
                question: 'Test question?',
                isMandatory: true,
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockEventQuestionsService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event questions', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, qKey: 'key1', question: 'Question 1', isMandatory: true },
                { id: 2, eventId: 1, qKey: 'key2', question: 'Question 2', isMandatory: false },
            ];

            mockEventQuestionsService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event questions for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, qKey: 'key1', question: 'Question 1', isMandatory: true },
            ];

            mockEventQuestionsService.findByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event question', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, qKey: 'key1', question: 'Question 1', isMandatory: true };

            mockEventQuestionsService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update an event question', async () => {
            const id = 1;
            const updateDto: UpdateEventQuestionDto = { question: 'Updated question' };
            const expectedResult = { id, eventId: 1, qKey: 'key1', question: 'Updated question', isMandatory: true };

            mockEventQuestionsService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event question', async () => {
            const id = 1;

            mockEventQuestionsService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
}); 