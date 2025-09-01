import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventPhotoGalleryDto } from './dto/create-event-photo-gallery.dto';
import { UpdateEventPhotoGalleryDto } from './dto/update-event-photo-gallery.dto';
import { EventPhotoGallery } from './entities/event-photo-gallery.entity';

@Injectable()
export class EventPhotoGalleryService {
    constructor(
        @InjectRepository(EventPhotoGallery)
        private eventPhotoGalleryRepository: Repository<EventPhotoGallery>,
    ) { }

    async findAll(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const [photos, total] = await this.eventPhotoGalleryRepository.findAndCount({
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
                withDeleted: false,
            });
            return {
                photos,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch event photos: ${error.message}`);
        }
    }

    async findOne(id: number) {
        try {
            const photo = await this.eventPhotoGalleryRepository.findOne({
                where: { id },
                withDeleted: false
            });
            if (!photo) {
                throw new NotFoundException('Event photo not found');
            }
            return photo;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch event photo: ${error.message}`);
        }
    }

    async findByEventId(eventId: number, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const [photos, total] = await this.eventPhotoGalleryRepository.findAndCount({
                where: { eventId },
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
                withDeleted: false,
            });
            return {
                photos,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch event photos for event: ${error.message}`);
        }
    }

    async create(createEventPhotoGalleryDto: CreateEventPhotoGalleryDto) {
        try {
            const photo = this.eventPhotoGalleryRepository.create(createEventPhotoGalleryDto);
            return await this.eventPhotoGalleryRepository.save(photo);
        } catch (error) {
            throw new BadRequestException(`Failed to create event photo: ${error.message}`);
        }
    }

    async update(id: number, updateEventPhotoGalleryDto: UpdateEventPhotoGalleryDto) {
        try {
            const photo = await this.eventPhotoGalleryRepository.findOne({
                where: { id },
                withDeleted: false
            });
            if (!photo) {
                throw new NotFoundException('Event photo not found');
            }
            await this.eventPhotoGalleryRepository.update(id, updateEventPhotoGalleryDto);
            return await this.findOne(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to update event photo: ${error.message}`);
        }
    }

    async remove(id: number) {
        try {
            const photo = await this.findOne(id);
            await this.eventPhotoGalleryRepository.softDelete(id);
            return { message: 'Event photo deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to delete event photo: ${error.message}`);
        }
    }

    async hardRemove(id: number) {
        try {
            const photo = await this.findOne(id);
            await this.eventPhotoGalleryRepository.remove(photo);
            return { message: 'Event photo permanently deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to permanently delete event photo: ${error.message}`);
        }
    }
} 