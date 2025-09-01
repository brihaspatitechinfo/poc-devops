import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventPriceDto } from './dto/create-event-price.dto';
import { UpdateEventPriceDto } from './dto/update-event-price.dto';
import { EventPricesService } from './event-prices.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('event-prices')
export class EventPricesController {
    constructor(private readonly eventPricesService: EventPricesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event price' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event price created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventPriceDto: CreateEventPriceDto) {
        return this.eventPricesService.create(createEventPriceDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple event prices' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event prices created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    bulkCreate(@Body() prices: CreateEventPriceDto[]) {
        return this.eventPricesService.bulkCreate(prices);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event prices' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event prices retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventPricesService.findAll();
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event prices by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event prices retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventPricesService.findByEventId(eventId);
    }

    @Get('currency/:currencyId')
    @ApiOperation({ summary: 'Get event prices by currency ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event prices retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByCurrencyId(@Param('currencyId', ParseIntPipe) currencyId: number) {
        return this.eventPricesService.findByCurrencyId(currencyId);
    }

    @Get('event/:eventId/currency-ids')
    @ApiOperation({ summary: 'Get currency IDs by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Currency IDs retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findCurrencyIdsByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventPricesService.findCurrencyIdsByEventId(eventId);
    }

    @Get('currency/:currencyId/event-ids')
    @ApiOperation({ summary: 'Get event IDs by currency ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event IDs retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findEventIdsByCurrencyId(@Param('currencyId', ParseIntPipe) currencyId: number) {
        return this.eventPricesService.findEventIdsByCurrencyId(currencyId);
    }

    @Get('event/:eventId/currency/:currencyId')
    @ApiOperation({ summary: 'Get event price by event ID and currency ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event price retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findPriceByEventAndCurrency(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Param('currencyId', ParseIntPipe) currencyId: number
    ) {
        return this.eventPricesService.findPriceByEventAndCurrency(eventId, currencyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event price by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event price retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventPricesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event price by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event price updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventPriceDto: UpdateEventPriceDto) {
        return this.eventPricesService.update(id, updateEventPriceDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event price by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event price deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventPricesService.remove(id);
    }

    @Delete('event/:eventId')
    @ApiOperation({ summary: 'Delete event prices by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event prices deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventPricesService.removeByEventId(eventId);
    }

    @Delete('currency/:currencyId')
    @ApiOperation({ summary: 'Delete event prices by currency ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event prices deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByCurrencyId(@Param('currencyId', ParseIntPipe) currencyId: number) {
        return this.eventPricesService.removeByCurrencyId(currencyId);
    }
} 