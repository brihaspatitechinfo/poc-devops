import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventCouponDto } from './dto/create-event-coupon.dto';
import { UpdateEventCouponDto } from './dto/update-event-coupon.dto';
import { EventCouponsService } from './event-coupons.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Event Coupons')
@Controller('event-coupons')
export class EventCouponsController {
    constructor(private readonly eventCouponsService: EventCouponsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event coupon' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event coupon created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventCouponDto: CreateEventCouponDto) {
        return this.eventCouponsService.create(createEventCouponDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple event coupons' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event coupons created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    bulkCreate(@Body() coupons: CreateEventCouponDto[]) {
        return this.eventCouponsService.bulkCreate(coupons);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event coupons' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupons retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventCouponsService.findAll();
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event coupons by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupons retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventCouponsService.findByEventId(eventId);
    }

    @Get('coupon/:couponId')
    @ApiOperation({ summary: 'Get event coupon by coupon ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupon retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByCouponId(@Param('couponId', ParseIntPipe) couponId: number) {
        return this.eventCouponsService.findByCouponId(couponId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event coupon by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupon retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventCouponsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event coupon by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupon updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventCouponDto: UpdateEventCouponDto) {
        return this.eventCouponsService.update(id, updateEventCouponDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event coupon by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupon deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventCouponsService.remove(id);
    }

    @Delete('event/:eventId')
    @ApiOperation({ summary: 'Delete event coupons by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupons deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventCouponsService.removeByEventId(eventId);
    }

    @Delete('coupon/:couponId')
    @ApiOperation({ summary: 'Delete event coupons by coupon ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event coupons deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByCouponId(@Param('couponId', ParseIntPipe) couponId: number) {
        return this.eventCouponsService.removeByCouponId(couponId);
    }
} 