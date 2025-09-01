import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventQuestionAnswerDto } from './dto/create-event-question-answer.dto';
import { UpdateEventQuestionAnswerDto } from './dto/update-event-question-answer.dto';
import { EventQuestionAnswer } from './entities/event-question-answer.entity';
import { EventQuestionAnswersService } from './event-question-answers.service';

describe('EventQuestionAnswersService', () => {
    let service: EventQuestionAnswersService;
    let repository: Repository<EventQuestionAnswer>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventQuestionAnswersService,
                {
                    provide: getRepositoryToken(EventQuestionAnswer),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventQuestionAnswersService>(EventQuestionAnswersService);
        repository = module.get<Repository<EventQuestionAnswer>>(getRepositoryToken(EventQuestionAnswer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event question answers', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' },
                { id: 2, eventId: 1, qKey: 'email', eventQuestionId: 2, candidateId: 123, answer: 'john@example.com' },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event question answers for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByEventId(eventId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { eventId: eventId }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByCandidateId', () => {
        it('should return event question answers for a specific candidate', async () => {
            const candidateId = 123;
            const expectedResult = [
                { id: 1, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: candidateId, answer: 'John Doe' },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByCandidateId(candidateId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { candidateId: candidateId }
            });
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

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByEventAndCandidate(eventId, candidateId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: {
                    eventId: eventId,
                    candidateId: candidateId
                }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event question answer', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findOne(id);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when event question answer not found', async () => {
            const id = 999;

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an event question answer', async () => {
            const id = 1;
            const updateDto: UpdateEventQuestionAnswerDto = { answer: 'Jane Doe' };
            const existingAnswer = { id, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' };
            const expectedResult = { ...existingAnswer, ...updateDto };

            mockRepository.findOne.mockResolvedValue(existingAnswer);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.update(id, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event question answer', async () => {
            const id = 1;
            const existingAnswer = { id, eventId: 1, qKey: 'name', eventQuestionId: 1, candidateId: 123, answer: 'John Doe' };

            mockRepository.findOne.mockResolvedValue(existingAnswer);
            mockRepository.remove.mockResolvedValue(existingAnswer);

            await service.remove(id);

            expect(mockRepository.remove).toHaveBeenCalledWith(existingAnswer);
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

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.bulkCreate(answers);

            expect(mockRepository.create).toHaveBeenCalledWith(answers);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });
}); 