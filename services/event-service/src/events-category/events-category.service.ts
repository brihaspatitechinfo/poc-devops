import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventsCategoryDto } from './dto/create-events-category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events-category.dto';
import { EventsCategory } from './entities/events-category.entity';

@Injectable()
export class EventsCategoryService {
    constructor(
        @InjectRepository(EventsCategory)
        private eventsCategoryRepository: Repository<EventsCategory>,
    ) { }

    async findAll(active: boolean, page: number = 1, limit: number = 10) {
        try {

            const whereClause = active ? { isActive: true } : {};
            const skip = (page - 1) * limit;
            const [eventsCategories, total] = await this.eventsCategoryRepository.findAndCount({
                skip,
                take: limit,
                order: { id: 'ASC' },
                withDeleted: false,
            });
            return {
                eventsCategories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch events categories: ${error.message}`);
        }
    }

    async findOne(id: number) {
        try {
            const eventsCategory = await this.eventsCategoryRepository.findOne({
                where: { id },
                withDeleted: false
            });
            if (!eventsCategory) {
                throw new NotFoundException('Events category not found');
            }
            return eventsCategory;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch events category: ${error.message}`);
        }
    }

    async findByEventId(eventId: number, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const [eventsCategories, total] = await this.eventsCategoryRepository.findAndCount({
                where: { eventId },
                skip,
                take: limit,
                order: { id: 'ASC' },
                withDeleted: false,
            });
            return {
                eventsCategories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch events categories for event: ${error.message}`);
        }
    }

    async findByCategoryId(categoryId: number, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const [eventsCategories, total] = await this.eventsCategoryRepository.findAndCount({
                where: { categoryId },
                skip,
                take: limit,
                order: { id: 'ASC' },
                withDeleted: false,
            });
            return {
                eventsCategories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch events categories for category: ${error.message}`);
        }
    }

    async create(createEventsCategoryDto: CreateEventsCategoryDto) {
        try {
            const eventsCategory = this.eventsCategoryRepository.create(createEventsCategoryDto);
            return await this.eventsCategoryRepository.save(eventsCategory);
        } catch (error) {
            throw new BadRequestException(`Failed to create events category: ${error.message}`);
        }
    }

    async update(id: number, updateEventsCategoryDto: UpdateEventsCategoryDto) {
        try {
            const eventsCategory = await this.eventsCategoryRepository.findOne({
                where: { id },
                withDeleted: false
            });
            if (!eventsCategory) {
                throw new NotFoundException('Events category not found');
            }
            await this.eventsCategoryRepository.update(id, updateEventsCategoryDto);
            return await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update events category: ${error.message}`);
        }
    }

    async remove(id: number) {
        try {
            const eventsCategory = await this.findOne(id);
            if (!eventsCategory) {
                throw new NotFoundException('Events category not found');
            }
            await this.eventsCategoryRepository.delete(id);
            return { message: 'Events category deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete events category: ${error.message}`);
        }
    }
} 