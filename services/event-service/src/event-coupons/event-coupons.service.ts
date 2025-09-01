import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventCouponDto } from './dto/create-event-coupon.dto';
import { UpdateEventCouponDto } from './dto/update-event-coupon.dto';
import { EventCoupon } from './entities/event-coupon.entity';

@Injectable()
export class EventCouponsService {
    constructor(
        @InjectRepository(EventCoupon)
        private eventCouponRepository: Repository<EventCoupon>,
    ) { }

    async create(createEventCouponDto: CreateEventCouponDto): Promise<EventCoupon> {
        try {
            const eventCoupon = this.eventCouponRepository.create(createEventCouponDto);
            return await this.eventCouponRepository.save(eventCoupon);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event coupon: ${error.message}`);
        }
    }

    async findAll(): Promise<EventCoupon[]> {
        try {
            return await this.eventCouponRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event coupons: ${error.message}`);
        }
    }

    async findByEventId(eventId: number): Promise<EventCoupon[]> {
        try {
            return await this.eventCouponRepository.find({ where: { eventId } });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event coupons by event ID: ${error.message}`);
        }
    }

    async findByCouponId(couponId: number): Promise<EventCoupon[]> {
        try {
            return await this.eventCouponRepository.find({ where: { couponId } });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event coupons by coupon ID: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventCoupon> {
        try {   
        const eventCoupon = await this.eventCouponRepository.findOne({ where: { id } });
        if (!eventCoupon) {
            throw new NotFoundException(`Event coupon with ID ${id} not found`);
            }
            return eventCoupon;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event coupon by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventCouponDto: UpdateEventCouponDto): Promise<EventCoupon> {
        try {
            const eventCoupon = await this.findOne(id);
            if (!eventCoupon) {
                throw new NotFoundException(`Event coupon with ID ${id} not found`);
            }
            Object.assign(eventCoupon, updateEventCouponDto);
            return await this.eventCouponRepository.save(eventCoupon);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while updating event coupon: ${error.message}`);
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
            const eventCoupon = await this.findOne(id);
            if (!eventCoupon) {
                throw new NotFoundException(`Event coupon with ID ${id} not found`);
            }
            await this.eventCouponRepository.remove(eventCoupon);
            return { message: 'Event coupon deleted' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while removing event coupon: ${error.message}`);
        }
    }

    async bulkCreate(coupons: CreateEventCouponDto[]): Promise<EventCoupon[]> {
        try {
            const eventCoupons = this.eventCouponRepository.create(coupons);
            return await this.eventCouponRepository.save(eventCoupons);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event coupons: ${error.message}`);
        }
    }

    async removeByEventId(eventId: number): Promise<void> {
        try {
            await this.eventCouponRepository.softDelete({ eventId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event coupons by event ID: ${error.message}`);
        }
    }

    async removeByCouponId(couponId: number): Promise<void> {
        try {
            await this.eventCouponRepository.softDelete({ couponId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event coupons by coupon ID: ${error.message}`);
        }
    }
} 