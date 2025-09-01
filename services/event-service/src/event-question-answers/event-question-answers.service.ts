import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventQuestionAnswerDto } from './dto/create-event-question-answer.dto';
import { UpdateEventQuestionAnswerDto } from './dto/update-event-question-answer.dto';
import { EventQuestionAnswer } from './entities/event-question-answer.entity';

@Injectable()
export class EventQuestionAnswersService {
    constructor(
        @InjectRepository(EventQuestionAnswer)
        private eventQuestionAnswerRepository: Repository<EventQuestionAnswer>,
    ) { }

    async create(createEventQuestionAnswerDto: CreateEventQuestionAnswerDto): Promise<EventQuestionAnswer> {
        try {
            const eventQuestionAnswer = this.eventQuestionAnswerRepository.create(createEventQuestionAnswerDto);
            return await this.eventQuestionAnswerRepository.save(eventQuestionAnswer);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event question answer: ${error.message}`);
        }
    }

    async findAll(): Promise<EventQuestionAnswer[]> {
        try {
            return await this.eventQuestionAnswerRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event question answers: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventQuestionAnswer[]> {
        try {
            return await this.eventQuestionAnswerRepository.find({
                where: { eventId: eventId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event question answers by event ID: ${error.message}`);
        }
    }

    async findByCandidateId(candidateId: number): Promise<EventQuestionAnswer[]> {
        try {
            return await this.eventQuestionAnswerRepository.find({
                where: { candidateId: candidateId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event question answers by candidate ID: ${error.message}`);
        }
    }

    async findByEventAndCandidate(eventId: number, candidateId: number): Promise<EventQuestionAnswer[]> {
        try {
            return await this.eventQuestionAnswerRepository.find({
                where: {
                    eventId: eventId,
                    candidateId: candidateId
                }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event question answers by event ID and candidate ID: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventQuestionAnswer> {
        try {
            const eventQuestionAnswer = await this.eventQuestionAnswerRepository.findOne({
                where: { id }
            });
            if (!eventQuestionAnswer) {
                throw new NotFoundException(`Event question answer with ID ${id} not found`);
            }
            return eventQuestionAnswer;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event question answer by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventQuestionAnswerDto: UpdateEventQuestionAnswerDto): Promise<EventQuestionAnswer> {
        try {
            const eventQuestionAnswer = await this.findOne(id);
            return await this.eventQuestionAnswerRepository.save(eventQuestionAnswer);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while updating event question answer: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventQuestionAnswer = await this.findOne(id);
            if (!eventQuestionAnswer) {
                throw new NotFoundException(`Event question answer with ID ${id} not found`);
            }
            await this.eventQuestionAnswerRepository.remove(eventQuestionAnswer);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event question answer: ${error.message}`);
        }
    }

    async bulkCreate(answers: CreateEventQuestionAnswerDto[]): Promise<EventQuestionAnswer[]> {
        try {
            const eventQuestionAnswers = this.eventQuestionAnswerRepository.create(answers);
            return await this.eventQuestionAnswerRepository.save(eventQuestionAnswers);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event question answers: ${error.message}`);
        }
    }
} 