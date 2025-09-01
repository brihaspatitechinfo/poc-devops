import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventsCategoryMasterDto } from './dto/create-events-category-master.dto';
import { UpdateEventsCategoryMasterDto } from './dto/update-events-category-master.dto';
import { EventsCategoryMaster } from './entities/events-category-master.entity';

@Injectable()
export class EventsCategoryMasterService {
    constructor(
        @InjectRepository(EventsCategoryMaster)
        private eventsCategoryMasterRepository: Repository<EventsCategoryMaster>,
    ) { }

    async findAll(active: boolean, page: number = 1, limit: number = 10) {
        try {
            const whereClause = active ? { isActive: true } : {};
            const skip = (page - 1) * limit;
            const [categories, total] = await this.eventsCategoryMasterRepository.findAndCount({
                skip,
                take: limit,
                where: whereClause,
                order: { sortOrder: 'ASC' },
            });
            return {
                categories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch event categories: ${error.message}`);
        }
    }

    async findOne(id: number) {
        try {
            const category = await this.eventsCategoryMasterRepository.findOne({ where: { id } });
            if (!category) {
                throw new NotFoundException('Event category not found');
            }
            return category;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch event category: ${error.message}`);
        }
    }

    async create(createEventsCategoryMasterDto: CreateEventsCategoryMasterDto) {
        try {
            const category = this.eventsCategoryMasterRepository.create(createEventsCategoryMasterDto);
            return await this.eventsCategoryMasterRepository.save(category);
        } catch (error) {
            throw new BadRequestException(`Failed to create event category: ${error.message}`);
        }
    }

    async update(id: number, updateEventsCategoryMasterDto: UpdateEventsCategoryMasterDto) {
        try {
            const category = await this.eventsCategoryMasterRepository.findOne({ where: { id } });
            if (!category) {
                throw new NotFoundException('Event category not found');
            }
            await this.eventsCategoryMasterRepository.update(id, updateEventsCategoryMasterDto);
            return await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update event category: ${error.message}`);
        }
    }

    async remove(id: number) {
        try {
            const category = await this.findOne(id);
            await this.eventsCategoryMasterRepository.remove(category);
            return { message: 'Event category deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete event category: ${error.message}`);
        }
    }
} 