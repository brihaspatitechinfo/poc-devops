import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventLocationsDto } from './dto/create-event-locations.dto';
import { UpdateEventLocationsDto } from './dto/update-event-locations.dto';
import { EventLocations } from './entities/event-locations.entity';

@Injectable()
export class EventLocationsService {
    constructor(
        @InjectRepository(EventLocations)
        private readonly eventLocationsRepository: Repository<EventLocations>,
    ) { }

    async create(createEventLocationsDto: CreateEventLocationsDto): Promise<EventLocations> {
        try {
            const eventLocations = this.eventLocationsRepository.create(createEventLocationsDto);
            return await this.eventLocationsRepository.save(eventLocations);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event locations: ${error.message}`);
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        eventId?: number,
        countryId?: number,
        stateId?: number,
        cityId?: number,
        locationId?: number
    ): Promise<{ data: EventLocations[]; total: number; page: number; limit: number }> {
        try {
        const queryBuilder = this.eventLocationsRepository.createQueryBuilder('eventLocations');
        if (eventId) {
            queryBuilder.andWhere('eventLocations.eventId = :eventId', { eventId });
        }

        if (countryId) {
            queryBuilder.andWhere('eventLocations.countryId = :countryId', { countryId });
        }

        if (stateId) {
            queryBuilder.andWhere('eventLocations.stateId = :stateId', { stateId });
        }

        if (cityId) {
            queryBuilder.andWhere('eventLocations.cityId = :cityId', { cityId });
        }

        if (locationId) {
            queryBuilder.andWhere('eventLocations.locationId = :locationId', { locationId });
        }

        const [data, total] = await queryBuilder
            .orderBy('eventLocations.createdAt', 'DESC')
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
            throw new InternalServerErrorException(`An error occurred while fetching event locations: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventLocations> {
        try {

        const eventLocations = await this.eventLocationsRepository.findOne({
            where: { id }
        });
        if (!eventLocations) {
            throw new NotFoundException(`Event locations with ID ${id} not found`);
        }
            return eventLocations;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event locations: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventLocations[]> {
        try {
        return await this.eventLocationsRepository.find({
            where: { eventId },
            order: { createdAt: 'DESC' }
        });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event locations by event ID: ${error.message}`);
        }
    }

    async findByCountryId(countryId: number): Promise<EventLocations[]> {
        try {
        return await this.eventLocationsRepository.find({
            where: { countryId },
            order: { createdAt: 'DESC' }
        });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event locations by country ID: ${error.message}`);
        }
    }

    async findByStateId(stateId: number): Promise<EventLocations[]> {
        try {
        return await this.eventLocationsRepository.find({
            where: { stateId },
            order: { createdAt: 'DESC' }
        });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event locations by state ID: ${error.message}`);
        }
    }

    async findByCityId(cityId: number): Promise<EventLocations[]> {
        try {
        return await this.eventLocationsRepository.find({
            where: { cityId },
            order: { createdAt: 'DESC' }
        });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event locations by city ID: ${error.message}`);
        }
    }

    async findByLocationId(locationId: number): Promise<EventLocations[]> {
        try {
        return await this.eventLocationsRepository.find({
            where: { locationId },
            order: { createdAt: 'DESC' }
        });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event locations by location ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventLocationsDto: UpdateEventLocationsDto): Promise<EventLocations> {
        try {
            const eventLocations = await this.findOne(id);
            Object.assign(eventLocations, updateEventLocationsDto);
            return await this.eventLocationsRepository.save(eventLocations);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while updating event locations: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventLocations = await this.findOne(id);
            await this.eventLocationsRepository.remove(eventLocations);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event locations: ${error.message}`);
        }
    }

    async softDelete(id: number): Promise<void> {
        try {
            const eventLocations = await this.findOne(id);
            await this.eventLocationsRepository.softDelete(id);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while soft deleting event locations: ${error.message}`);
        }
    }

    async restore(id: number): Promise<void> {
        try {
            await this.eventLocationsRepository.restore(id);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while restoring event locations: ${error.message}`);
        }
    }
} 