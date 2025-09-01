import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventQuestionDto } from './dto/create-event-question.dto';
import { UpdateEventQuestionDto } from './dto/update-event-question.dto';
import { EventQuestion } from './entities/event-question.entity';

@Injectable()
export class EventQuestionsService {
    constructor(
        @InjectRepository(EventQuestion)
        private eventQuestionRepository: Repository<EventQuestion>,
    ) { }

    async create(createEventQuestionDto: CreateEventQuestionDto): Promise<EventQuestion> {
        try {
            const eventQuestion = this.eventQuestionRepository.create(createEventQuestionDto);
            return await this.eventQuestionRepository.save(eventQuestion);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event question: ${error.message}`);
        }
    }

    async findAll(): Promise<EventQuestion[]> {
        try {
            return await this.eventQuestionRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event questions: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventQuestion[]> {
        try {
            return await this.eventQuestionRepository.find({
                where: { eventId: eventId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event questions by event ID: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventQuestion> {
        try {
            const eventQuestion = await this.eventQuestionRepository.findOne({
                where: { id }
            });
            if (!eventQuestion) {
                throw new NotFoundException(`Event question with ID ${id} not found`);
            }
            return eventQuestion;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event question by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventQuestionDto: UpdateEventQuestionDto): Promise<EventQuestion> {
        try {
            const eventQuestion = await this.findOne(id);
            if (!eventQuestion) {
                throw new NotFoundException(`Event question with ID ${id} not found`);
            }
            return await this.eventQuestionRepository.save(eventQuestion);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while updating event question: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventQuestion = await this.findOne(id);
            if (!eventQuestion) {
                throw new NotFoundException(`Event question with ID ${id} not found`);
            }
            await this.eventQuestionRepository.softDelete(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while removing event question: ${error.message}`);
        }
    }
} 