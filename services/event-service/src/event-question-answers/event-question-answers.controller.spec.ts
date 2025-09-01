import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventQuestionAnswerDto } from './dto/create-event-question-answer.dto';
import { UpdateEventQuestionAnswerDto } from './dto/update-event-question-answer.dto';
import { EventQuestionAnswersController } from './event-question-answers.controller';
import { EventQuestionAnswersService } from './event-question-answers.service';

describe('EventQuestionAnswersController', () => {
    let controller: EventQuestionAnswersController;
    let service: EventQuestionAnswersService;

    const mockEventQuestionAnswersService = {
        create: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn(),
        findByEventId: jest.fn(),
        findByCandidateId: jest.fn(),
        findByEventAndCandidate: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventQuestionAnswersController],
            providers: [
                {
                    provide: EventQuestionAnswersService,
                    useValue: mockEventQuestionAnswersService,
                },
            ],
        }).compile();

        controller = module.get<EventQuestionAnswersController>(EventQuestionAnswersController);
        service = module.get<EventQuestionAnswersService>(EventQuestionAnswersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event question answer', async () => {
            const createDto: CreateEventQuestionAnswerDto = {
                eventId: 1,
                qKey: 'name',
                eventQuestionId: 1,
                candidateId: 123,
                answer: 'John Doe',
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockEventQuestionAnswersService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event question answers', async () => {
            const answers: CreateEventQuestionAnswerDto[] = [
                { eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' },
                { eventId: 1, qKey: 'email', eventQuestionId: 2, candidateId: 123, answer: 'john@example.com' },
            ];

            const expectedResult = [
                { id: 1, ...answers[0], createdAt: new Date(), updatedAt: new Date() },
                { id: 2, ...answers[1], createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventQuestionAnswersService.bulkCreate.mockResolvedValue(expectedResult);

            const result = await controller.bulkCreate(answers);

            expect(service.bulkCreate).toHaveBeenCalledWith(answers);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event question answers', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' },
                { id: 2, eventId: 1, qKey: 'email', eventQuestionId: 2, candidateId: 123, answer: 'john@example.com' },
            ];

            mockEventQuestionAnswersService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event question answers for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' },
            ];

            mockEventQuestionAnswersService.findByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByCandidateId', () => {
        it('should return event question answers for a specific candidate', async () => {
            const candidateId = 123;
            const expectedResult = [
                { id: 1, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: candidateId, answer: 'John Doe' },
            ];

            mockEventQuestionAnswersService.findByCandidateId.mockResolvedValue(expectedResult);

            const result = await controller.findByCandidateId(candidateId);

            expect(service.findByCandidateId).toHaveBeenCalledWith(candidateId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventAndCandidate', () => {
        it('should return event question answers for a specific event and candidate', async () => {
            const eventId = 1;
            const candidateId = 123;
            const expectedResult = [
                { id: 1, eventId: eventId, qKey: 'name', eventQuestionId: 1, candidateId: candidateId, answer: 'John Doe' },
            ];

            mockEventQuestionAnswersService.findByEventAndCandidate.mockResolvedValue(expectedResult);

            const result = await controller.findByEventAndCandidate(eventId, candidateId);

            expect(service.findByEventAndCandidate).toHaveBeenCalledWith(eventId, candidateId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event question answer', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' };

            mockEventQuestionAnswersService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update an event question answer', async () => {
            const id = 1;
            const updateDto: UpdateEventQuestionAnswerDto = { answer: 'Jane Doe' };
            const expectedResult = { id, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'Jane Doe' };

            mockEventQuestionAnswersService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event question answer', async () => {
            const id = 1;

            mockEventQuestionAnswersService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
}); 