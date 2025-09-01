import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateEventTagMasterDto } from './dto/create-event-tag-master.dto';
import { UpdateEventTagMasterDto } from './dto/update-event-tag-master.dto';
import { EventTagMaster } from './entities/event-tag-master.entity';

@Injectable()
export class EventTagMasterService {
    constructor(
        @InjectRepository(EventTagMaster)
        private readonly eventTagMasterRepository: Repository<EventTagMaster>,
    ) { }

    async create(createEventTagMasterDto: CreateEventTagMasterDto): Promise<EventTagMaster> {
        try {
            const existingTag = await this.eventTagMasterRepository.findOne({ where: { tag: createEventTagMasterDto.tag } });
            if (existingTag) {
                throw new ConflictException(`Tag '${createEventTagMasterDto.tag}' already exists`);
            }
            const eventTagMaster = this.eventTagMasterRepository.create(createEventTagMasterDto);
            return await this.eventTagMasterRepository.save(eventTagMaster);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while creating event tag master: ${error.message}`);
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        tag?: string,
        isPreferred?: boolean
    ): Promise<{ data: EventTagMaster[]; total: number; page: number; limit: number }> {

        try {
            const queryBuilder = this.eventTagMasterRepository.createQueryBuilder('eventTagMaster');
            if (tag) {
                queryBuilder.where('eventTagMaster.tag LIKE :tag', { tag: `%${tag}%` });
            }
            if (isPreferred !== undefined) {
                queryBuilder.andWhere('eventTagMaster.isPreferred = :isPreferred', { isPreferred: isPreferred });
            }
            const [data, total] = await queryBuilder
                .orderBy('eventTagMaster.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data,
                total,
                page,
                limit,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event tag master: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventTagMaster> {
        try {
            const eventTagMaster = await this.eventTagMasterRepository.findOne({ where: { id }});
            if (!eventTagMaster) {
                throw new NotFoundException(`Event tag master with ID ${id} not found`);
            }
            return eventTagMaster;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event one tag master: ${error.message}`);
        }
    }

    async findByTag(tag: string): Promise<EventTagMaster[]> {
        try {
            return await this.eventTagMasterRepository.find({ where: { tag: Like(`%${tag}%`) }});
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event by tag: ${error.message}`);
        }
    }

    async findPreferred(): Promise<EventTagMaster[]> {
        try {   
        return await this.eventTagMasterRepository.find({
            where: { isPreferred: 1 },
            order: { createdAt: 'DESC' }
        });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching preferred event tag: ${error.message}`);
        }
    }

    async update(id: number, updateEventTagMasterDto: UpdateEventTagMasterDto): Promise<EventTagMaster> {
        try {

        const eventTagMaster = await this.findOne(id);
        if (updateEventTagMasterDto.tag && updateEventTagMasterDto.tag !== eventTagMaster.tag) {
            const existingTag = await this.eventTagMasterRepository.findOne({
                where: { tag: updateEventTagMasterDto.tag }
            });
            if (existingTag) {
                throw new ConflictException(`Tag '${updateEventTagMasterDto.tag}' already exists`);
            }
        }
        const updateData: any = { ...updateEventTagMasterDto };
        Object.assign(eventTagMaster, updateData);
            return await this.eventTagMasterRepository.save(eventTagMaster);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while updating event tag master: ${error.message}`);
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
            const eventTagMaster = await this.findOne(id);
            if (!eventTagMaster) {
                throw new NotFoundException(`Event tag master with ID ${id} not found`);
            }
            await this.eventTagMasterRepository.remove(eventTagMaster);
            return { message: 'Event tag master deleted' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while removing event tag master: ${error.message}`);
        }
    }
    async togglePreferred(id: number): Promise<EventTagMaster> {
        try {
            const eventTagMaster = await this.findOne(id);
            return await this.eventTagMasterRepository.save(eventTagMaster);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while toggling preferred event tag: ${error.message}`);
        }
    }
} 