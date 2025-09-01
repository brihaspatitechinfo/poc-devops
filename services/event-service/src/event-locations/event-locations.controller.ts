import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventLocationsDto } from './dto/create-event-locations.dto';
import { UpdateEventLocationsDto } from './dto/update-event-locations.dto';
import { EventLocations } from './entities/event-locations.entity';
import { EventLocationsService } from './event-locations.service';

@ApiTags('Event Locations')
@Controller('event-locations')
export class EventLocationsController {
    constructor(private readonly eventLocationsService: EventLocationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event locations record' })
    @ApiResponse({ status: 201, description: 'Event locations created successfully', type: EventLocations })
    create(@Body() createEventLocationsDto: CreateEventLocationsDto): Promise<EventLocations> {
        return this.eventLocationsService.create(createEventLocationsDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event locations with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'eventId', required: false, type: Number, description: 'Filter by event ID' })
    @ApiQuery({ name: 'countryId', required: false, type: Number, description: 'Filter by country ID' })
    @ApiQuery({ name: 'stateId', required: false, type: Number, description: 'Filter by state ID' })
    @ApiQuery({ name: 'cityId', required: false, type: Number, description: 'Filter by city ID' })
    @ApiQuery({ name: 'locationId', required: false, type: Number, description: 'Filter by location ID' })
    @ApiResponse({ status: 200, description: 'List of event locations' })
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('eventId', new DefaultValuePipe(undefined)) eventId?: number,
        @Query('countryId', new DefaultValuePipe(undefined)) countryId?: number,
        @Query('stateId', new DefaultValuePipe(undefined)) stateId?: number,
        @Query('cityId', new DefaultValuePipe(undefined)) cityId?: number,
        @Query('locationId', new DefaultValuePipe(undefined)) locationId?: number,
    ) {
        return this.eventLocationsService.findAll(page, limit, eventId, countryId, stateId, cityId, locationId);
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event locations by event ID' })
    @ApiParam({ name: 'eventId', description: 'Event ID' })
    @ApiResponse({ status: 200, description: 'List of event locations for the event', type: [EventLocations] })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number): Promise<EventLocations[]> {
        return this.eventLocationsService.findByEventId(eventId);
    }

    @Get('country/:countryId')
    @ApiOperation({ summary: 'Get event locations by country ID' })
    @ApiParam({ name: 'countryId', description: 'Country ID' })
    @ApiResponse({ status: 200, description: 'List of event locations in the country', type: [EventLocations] })
    findByCountryId(@Param('countryId', ParseIntPipe) countryId: number): Promise<EventLocations[]> {
        return this.eventLocationsService.findByCountryId(countryId);
    }

    @Get('state/:stateId')
    @ApiOperation({ summary: 'Get event locations by state ID' })
    @ApiParam({ name: 'stateId', description: 'State ID' })
    @ApiResponse({ status: 200, description: 'List of event locations in the state', type: [EventLocations] })
    findByStateId(@Param('stateId', ParseIntPipe) stateId: number): Promise<EventLocations[]> {
        return this.eventLocationsService.findByStateId(stateId);
    }

    @Get('city/:cityId')
    @ApiOperation({ summary: 'Get event locations by city ID' })
    @ApiParam({ name: 'cityId', description: 'City ID' })
    @ApiResponse({ status: 200, description: 'List of event locations in the city', type: [EventLocations] })
    findByCityId(@Param('cityId', ParseIntPipe) cityId: number): Promise<EventLocations[]> {
        return this.eventLocationsService.findByCityId(cityId);
    }

    @Get('location/:locationId')
    @ApiOperation({ summary: 'Get event locations by location ID' })
    @ApiParam({ name: 'locationId', description: 'Location ID' })
    @ApiResponse({ status: 200, description: 'List of event locations for the specific location', type: [EventLocations] })
    findByLocationId(@Param('locationId', ParseIntPipe) locationId: number): Promise<EventLocations[]> {
        return this.eventLocationsService.findByLocationId(locationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event locations by ID' })
    @ApiParam({ name: 'id', description: 'Event locations ID' })
    @ApiResponse({ status: 200, description: 'Event locations found', type: EventLocations })
    @ApiResponse({ status: 404, description: 'Event locations not found' })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<EventLocations> {
        return this.eventLocationsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event locations by ID' })
    @ApiParam({ name: 'id', description: 'Event locations ID' })
    @ApiResponse({ status: 200, description: 'Event locations updated successfully', type: EventLocations })
    @ApiResponse({ status: 404, description: 'Event locations not found' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEventLocationsDto: UpdateEventLocationsDto,
    ): Promise<EventLocations> {
        return this.eventLocationsService.update(id, updateEventLocationsDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event locations by ID (hard delete)' })
    @ApiParam({ name: 'id', description: 'Event locations ID' })
    @ApiResponse({ status: 200, description: 'Event locations deleted successfully' })
    @ApiResponse({ status: 404, description: 'Event locations not found' })
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.eventLocationsService.remove(id);
    }

    @Delete(':id/soft')
    @ApiOperation({ summary: 'Soft delete event locations by ID' })
    @ApiParam({ name: 'id', description: 'Event locations ID' })
    @ApiResponse({ status: 200, description: 'Event locations soft deleted successfully' })
    @ApiResponse({ status: 404, description: 'Event locations not found' })
    softDelete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.eventLocationsService.softDelete(id);
    }

    @Patch(':id/restore')
    @ApiOperation({ summary: 'Restore soft deleted event locations by ID' })
    @ApiParam({ name: 'id', description: 'Event locations ID' })
    @ApiResponse({ status: 200, description: 'Event locations restored successfully' })
    restore(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.eventLocationsService.restore(id);
    }
} 