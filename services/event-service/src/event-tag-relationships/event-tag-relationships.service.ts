import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventTagRelationshipDto } from './dto/create-event-tag-relationship.dto';
import { UpdateEventTagRelationshipDto } from './dto/update-event-tag-relationship.dto';
import { EventTagRelationship } from './entities/event-tag-relationship.entity';

@Injectable()
export class EventTagRelationshipsService {
    constructor(
        @InjectRepository(EventTagRelationship)
        private eventTagRelationshipRepository: Repository<EventTagRelationship>,
    ) { }

    async create(createEventTagRelationshipDto: CreateEventTagRelationshipDto): Promise<EventTagRelationship> {
        try {
            const eventTagRelationship = this.eventTagRelationshipRepository.create(createEventTagRelationshipDto);
            return await this.eventTagRelationshipRepository.save(eventTagRelationship);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event tag relationship: ${error.message}`);
        }
    }

    async findAll(): Promise<EventTagRelationship[]> {
        try {
            return await this.eventTagRelationshipRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event tag relationships: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventTagRelationship[]> {
        try {
            return await this.eventTagRelationshipRepository.find({
                where: { eventId: eventId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event tag relationships by event ID: ${error.message}`);
        }
    }

    async findByTagId(tagId: number): Promise<EventTagRelationship[]> {
        try {
            return await this.eventTagRelationshipRepository.find({
                where: { tagId: tagId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event tag relationships by tag ID: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventTagRelationship> {
        try {
            const eventTagRelationship = await this.eventTagRelationshipRepository.findOne({
                where: { id }
            });
            if (!eventTagRelationship) {
                throw new NotFoundException(`Event tag relationship with ID ${id} not found`);
            }
            return eventTagRelationship;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event tag relationship by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventTagRelationshipDto: UpdateEventTagRelationshipDto): Promise<EventTagRelationship> {
        try {
            const eventTagRelationship = await this.findOne(id);
            Object.assign(eventTagRelationship, updateEventTagRelationshipDto);
            return await this.eventTagRelationshipRepository.save(eventTagRelationship);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while updating event tag relationship: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventTagRelationship = await this.findOne(id);
            if (!eventTagRelationship) {
                throw new NotFoundException(`Event tag relationship with ID ${id} not found`);
            }
            await this.eventTagRelationshipRepository.remove(eventTagRelationship);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while removing event tag relationship: ${error.message}`);
        }
    }

    async bulkCreate(relationships: CreateEventTagRelationshipDto[]): Promise<EventTagRelationship[]> {
        try {
            const eventTagRelationships = this.eventTagRelationshipRepository.create(relationships);
            return await this.eventTagRelationshipRepository.save(eventTagRelationships);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event tag relationships: ${error.message}`);
        }
    }

    async removeByEventId(eventId: number): Promise<void> {
        try {
            await this.eventTagRelationshipRepository.delete({ eventId: eventId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event tag relationships by event ID: ${error.message}`);
        }
    }

    async removeByTagId(tagId: number): Promise<void> {
        try {
            await this.eventTagRelationshipRepository.delete({ tagId: tagId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event tag relationships by tag ID: ${error.message}`);
        }
    }

    async findEventIdsByTagId(tagId: number): Promise<number[]> {
        try {
            const relationships = await this.findByTagId(tagId);
            return relationships.map(rel => rel.eventId);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event IDs by tag ID: ${error.message}`);
        }
    }

    async findTagIdsByEventId(eventId: number): Promise<number[]> {
        try {
            const relationships = await this.findByEventId(eventId);
            return relationships.map(rel => rel.tagId);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching tag IDs by event ID: ${error.message}`);
        }
    }
} 