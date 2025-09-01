import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventPhotoGalleryDto } from './dto/create-event-photo-gallery.dto';
import { UpdateEventPhotoGalleryDto } from './dto/update-event-photo-gallery.dto';
import { EventPhotoGalleryService } from './event-photo-gallery.service';

@ApiTags('Event Photo Gallery')
@Controller('event-photo-gallery')
export class EventPhotoGalleryController {
    constructor(private readonly eventPhotoGalleryService: EventPhotoGalleryService) { }

    @Get()
    @ApiOperation({ summary: 'Get all event photos' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event photos retrieved successfully' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
        return this.eventPhotoGalleryService.findAll(page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event photo by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event photo retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event photo not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Event photo ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventPhotoGalleryService.findOne(id);
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event photos by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event photos retrieved successfully' })
    @ApiParam({ name: 'eventId', type: Number, description: 'Event ID' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    async findByEventId(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        return this.eventPhotoGalleryService.findByEventId(eventId, page, limit);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new event photo' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event photo created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    async create(@Body() createEventPhotoGalleryDto: CreateEventPhotoGalleryDto) {
        return this.eventPhotoGalleryService.create(createEventPhotoGalleryDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update event photo by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event photo updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event photo not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    @ApiParam({ name: 'id', type: Number, description: 'Event photo ID' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEventPhotoGalleryDto: UpdateEventPhotoGalleryDto
    ) {
        return this.eventPhotoGalleryService.update(id, updateEventPhotoGalleryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete event photo by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event photo deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event photo not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Event photo ID' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventPhotoGalleryService.remove(id);
    }

    @Delete(':id/permanent')
    @ApiOperation({ summary: 'Permanently delete event photo by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event photo permanently deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event photo not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Event photo ID' })
    async hardRemove(@Param('id', ParseIntPipe) id: number) {
        return this.eventPhotoGalleryService.hardRemove(id);
    }
} 