import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventTagRelationshipDto } from './dto/create-event-tag-relationship.dto';
import { UpdateEventTagRelationshipDto } from './dto/update-event-tag-relationship.dto';
import { EventTagRelationshipsService } from './event-tag-relationships.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('event-tag-relationships')
export class EventTagRelationshipsController {
    constructor(private readonly eventTagRelationshipsService: EventTagRelationshipsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event tag relationship' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event tag relationship created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventTagRelationshipDto: CreateEventTagRelationshipDto) {
        return this.eventTagRelationshipsService.create(createEventTagRelationshipDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple event tag relationships' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event tag relationships created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    bulkCreate(@Body() relationships: CreateEventTagRelationshipDto[]) {
        return this.eventTagRelationshipsService.bulkCreate(relationships);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event tag relationships' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationships retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventTagRelationshipsService.findAll();
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event tag relationships by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationships retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventTagRelationshipsService.findByEventId(eventId);
    }

    @Get('tag/:tagId')
    @ApiOperation({ summary: 'Get event tag relationships by tag ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationships retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByTagId(@Param('tagId', ParseIntPipe) tagId: number) {
        return this.eventTagRelationshipsService.findByTagId(tagId);
    }

    @Get('event/:eventId/tag-ids')
    @ApiOperation({ summary: 'Get tag IDs by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Tag IDs retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findTagIdsByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventTagRelationshipsService.findTagIdsByEventId(eventId);
    }

    @Get('tag/:tagId/event-ids')
    @ApiOperation({ summary: 'Get event IDs by tag ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event IDs retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findEventIdsByTagId(@Param('tagId', ParseIntPipe) tagId: number) {
        return this.eventTagRelationshipsService.findEventIdsByTagId(tagId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event tag relationship by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationship retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventTagRelationshipsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event tag relationship by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationship updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventTagRelationshipDto: UpdateEventTagRelationshipDto) {
        return this.eventTagRelationshipsService.update(id, updateEventTagRelationshipDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event tag relationship by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationship deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventTagRelationshipsService.remove(id);
    }

    @Delete('event/:eventId')
    @ApiOperation({ summary: 'Delete event tag relationships by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationships deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventTagRelationshipsService.removeByEventId(eventId);
    }

    @Delete('tag/:tagId')
    @ApiOperation({ summary: 'Delete event tag relationships by tag ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag relationships deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByTagId(@Param('tagId', ParseIntPipe) tagId: number) {
        return this.eventTagRelationshipsService.removeByTagId(tagId);
    }
} 