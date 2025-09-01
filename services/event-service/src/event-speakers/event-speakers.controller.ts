import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateEventSpeakerDto } from './dto/create-event-speaker.dto';
import { UpdateEventSpeakerDto } from './dto/update-event-speaker.dto';
import { EventSpeakersService } from './event-speakers.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('event-speakers')
export class EventSpeakersController {
    constructor(private readonly eventSpeakersService: EventSpeakersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event speaker' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event speaker created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventSpeakerDto: CreateEventSpeakerDto) {
        return this.eventSpeakersService.create(createEventSpeakerDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple event speakers' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event speakers created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    bulkCreate(@Body() speakers: CreateEventSpeakerDto[]) {
        return this.eventSpeakersService.bulkCreate(speakers);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event speakers' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventSpeakersService.findAll();
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event speakers by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventSpeakersService.findByEventId(eventId);
    }

    @Get('name/:name')
    @ApiOperation({ summary: 'Get event speakers by name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByName(@Param('name') name: string) {
        return this.eventSpeakersService.findByName(name);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search event speakers by name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    searchByName(@Query('q') searchTerm: string) {
        return this.eventSpeakersService.searchByName(searchTerm);
    }

    @Get('with-linkedin')
    @ApiOperation({ summary: 'Get event speakers with LinkedIn profile' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findSpeakersWithLinkedIn() {
        return this.eventSpeakersService.findSpeakersWithLinkedIn();
    }

    @Get('with-image')
    @ApiOperation({ summary: 'Get event speakers with image' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findSpeakersWithImage() {
        return this.eventSpeakersService.findSpeakersWithImage();
    }

    @Get('designation/:designation')
    @ApiOperation({ summary: 'Get event speakers by designation' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findSpeakersByDesignation(@Param('designation') designation: string) {
        return this.eventSpeakersService.findSpeakersByDesignation(designation);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event speaker by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speaker retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventSpeakersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event speaker by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speaker updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventSpeakerDto: UpdateEventSpeakerDto) {
        return this.eventSpeakersService.update(id, updateEventSpeakerDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event speaker by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speaker deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventSpeakersService.remove(id);
    }

    @Delete('event/:eventId')
    @ApiOperation({ summary: 'Delete event speakers by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event speakers deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventSpeakersService.removeByEventId(eventId);
    }
} 