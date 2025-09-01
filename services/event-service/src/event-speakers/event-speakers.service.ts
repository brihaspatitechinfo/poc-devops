import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateEventSpeakerDto } from './dto/create-event-speaker.dto';
import { UpdateEventSpeakerDto } from './dto/update-event-speaker.dto';
import { EventSpeaker } from './entities/event-speaker.entity';

@Injectable()
export class EventSpeakersService {
    constructor(
        @InjectRepository(EventSpeaker)
        private eventSpeakerRepository: Repository<EventSpeaker>,
    ) { }

    async create(createEventSpeakerDto: CreateEventSpeakerDto): Promise<EventSpeaker> {
        try {
            const eventSpeaker = this.eventSpeakerRepository.create(createEventSpeakerDto);
            return await this.eventSpeakerRepository.save(eventSpeaker);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event speaker: ${error.message}`);
        }
    }

    async findAll(): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event speakers: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository.find({
                where: { eventId: eventId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event speakers by event ID: ${error.message}`);
        }
    }

    async findByName(name: string): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository.find({
                where: { name: name }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event speakers by name: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventSpeaker> {
        try {
            const eventSpeaker = await this.eventSpeakerRepository.findOne({
                where: { id }
            });
            if (!eventSpeaker) {
                throw new NotFoundException(`Event speaker with ID ${id} not found`);
            }
            return eventSpeaker;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event speaker by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventSpeakerDto: UpdateEventSpeakerDto): Promise<EventSpeaker> {
        try {
            const eventSpeaker = await this.findOne(id);
            Object.assign(eventSpeaker, updateEventSpeakerDto);
            return await this.eventSpeakerRepository.save(eventSpeaker);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while updating event speaker: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventSpeaker = await this.findOne(id);
            if (!eventSpeaker) {
                throw new NotFoundException(`Event speaker with ID ${id} not found`);
            }
            await this.eventSpeakerRepository.softRemove(eventSpeaker);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while removing event speaker: ${error.message}`);
        }
    }

    async bulkCreate(speakers: CreateEventSpeakerDto[]): Promise<EventSpeaker[]> {
        try {
            const eventSpeakers = this.eventSpeakerRepository.create(speakers);
            return await this.eventSpeakerRepository.save(eventSpeakers);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event speakers: ${error.message}`);
        }
    }

    async removeByEventId(eventId: number): Promise<void> {
        try {
            await this.eventSpeakerRepository.softDelete({ eventId: eventId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event speakers by event ID: ${error.message}`);
        }
    }

    async searchByName(searchTerm: string): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository
                .createQueryBuilder('speaker')
                .where('speaker.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while searching event speakers by name: ${error.message}`);
        }
    }

    async findSpeakersWithLinkedIn(): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository.find({
                where: { linkedinProfile: Not(IsNull()) }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event speakers with LinkedIn profile: ${error.message}`);
        }
    }

    async findSpeakersWithImage(): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository.find({
                where: { image: Not(IsNull()) }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event speakers with image: ${error.message}`);
        }
    }

    async findSpeakersByDesignation(designation: string): Promise<EventSpeaker[]> {
        try {
            return await this.eventSpeakerRepository.find({
                where: { designation: designation }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event speakers by designation: ${error.message}`);
        }
    }
} 