import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventPriceDto } from './dto/create-event-price.dto';
import { UpdateEventPriceDto } from './dto/update-event-price.dto';
import { EventPrice } from './entities/event-price.entity';

@Injectable()
export class EventPricesService {
    constructor(
        @InjectRepository(EventPrice)
        private eventPriceRepository: Repository<EventPrice>,
    ) { }

    async create(createEventPriceDto: CreateEventPriceDto): Promise<EventPrice> {
        try {
            const eventPrice = this.eventPriceRepository.create(createEventPriceDto);
            return await this.eventPriceRepository.save(eventPrice);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event price: ${error.message}`);
        }
    }

    async findAll(): Promise<EventPrice[]> {
        try {
            return await this.eventPriceRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event prices: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventPrice[]> {
        try {
            return await this.eventPriceRepository.find({
                where: { eventId: eventId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event prices by event ID: ${error.message}`);
        }
    }

    async findByCurrencyId(currencyId: number): Promise<EventPrice[]> {
        try {
            return await this.eventPriceRepository.find({
                where: { currencyId: currencyId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event prices by currency ID: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventPrice> {
        try {
            const eventPrice = await this.eventPriceRepository.findOne({
                where: { id }
            });

            if (!eventPrice) {
                throw new NotFoundException(`Event price with ID ${id} not found`);
            }
            return eventPrice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event price by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventPriceDto: UpdateEventPriceDto): Promise<EventPrice> {
        try {
            const eventPrice = await this.findOne(id);
            // Object.assign(eventPrice, updateEventPriceDto);
            return await this.eventPriceRepository.save(eventPrice);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while updating event price: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventPrice = await this.findOne(id);
            await this.eventPriceRepository.remove(eventPrice);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event price: ${error.message}`);
        }
    }

    async bulkCreate(prices: CreateEventPriceDto[]): Promise<EventPrice[]> {
        try {
            const eventPrices = this.eventPriceRepository.create(prices);
            return await this.eventPriceRepository.save(eventPrices);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event prices: ${error.message}`);
        }
    }

    async removeByEventId(eventId: number): Promise<void> {
        try {
            await this.eventPriceRepository.delete({ eventId: eventId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event prices by event ID: ${error.message}`);
        }
    }

    async removeByCurrencyId(currencyId: number): Promise<void> {
        try {
            await this.eventPriceRepository.delete({ currencyId: currencyId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event prices by currency ID: ${error.message}`);
        }
    }

    async findEventIdsByCurrencyId(currencyId: number): Promise<number[]> {
        try {
            const prices = await this.findByCurrencyId(currencyId);
            return prices.map(price => price.eventId);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event IDs by currency ID: ${error.message}`);
        }
    }

    async findCurrencyIdsByEventId(eventId: number): Promise<number[]> {
        try {
            const prices = await this.findByEventId(eventId);
            return prices.map(price => price.currencyId);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching currency IDs by event ID: ${error.message}`);
        }
    }

    async findPriceByEventAndCurrency(eventId: number, currencyId: number): Promise<EventPrice | null> {
        try {
        return await this.eventPriceRepository.findOne({
            where: {
                eventId: eventId,
                currencyId: currencyId
            }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event price by event ID and currency ID: ${error.message}`);
        }
    }
} 