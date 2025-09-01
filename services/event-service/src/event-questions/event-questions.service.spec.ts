import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventQuestionDto } from './dto/create-event-question.dto';
import { UpdateEventQuestionDto } from './dto/update-event-question.dto';
import { EventQuestion } from './entities/event-question.entity';
import { EventQuestionsService } from './event-questions.service';

describe('EventQuestionsService', () => {
    let service: EventQuestionsService;
    let repository: Repository<EventQuestion>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventQuestionsService,
                {
                    provide: getRepositoryToken(EventQuestion),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventQuestionsService>(EventQuestionsService);
        repository = module.get<Repository<EventQuestion>>(getRepositoryToken(EventQuestion));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event questions', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, qKey: 'key1', question: 'Question 1', isMandatory: true },
                { id: 2, eventId: 1, qKey: 'key2', question: 'Question 2', isMandatory: false },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { deletedAt: null }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event questions for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, qKey: 'key1', question: 'Question 1', isMandatory: true },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByEventId(eventId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: {
                    eventId: eventId,
                    deletedAt: null
                }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event question', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, qKey: 'key1', question: 'Question 1', isMandatory: true };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findOne(id);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id,
                    deletedAt: null
                }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when event question not found', async () => {
            const id = 999;

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an event question', async () => {
            const id = 1;
            const updateDto: UpdateEventQuestionDto = { question: 'Updated question' };
            const existingQuestion = { id, eventId: 1, qKey: 'key1', question: 'Old question', isMandatory: true };
            const expectedResult = { ...existingQuestion, ...updateDto };

            mockRepository.findOne.mockResolvedValue(existingQuestion);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.update(id, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should soft delete an event question', async () => {
            const id = 1;
            const existingQuestion = { id, eventId: 1, qKey: 'key1', question: 'Question 1', isMandatory: true };

            mockRepository.findOne.mockResolvedValue(existingQuestion);
            mockRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.remove(id);

            expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
        });
    });
}); 