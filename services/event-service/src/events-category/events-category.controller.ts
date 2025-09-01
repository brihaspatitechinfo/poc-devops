import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventsCategoryDto } from './dto/create-events-category.dto';
import { UpdateEventsCategoryDto } from './dto/update-events-category.dto';
import { EventsCategoryService } from './events-category.service';

@ApiTags('Events Category')
@Controller('events-category')
export class EventsCategoryController {
    constructor(private readonly eventsCategoryService: EventsCategoryService) { }

    @Get()
    @ApiOperation({ summary: 'Get all events categories' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events categories retrieved successfully' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    async findAll(@Query('active') active = true, @Query('page') page = 1, @Query('limit') limit = 10) {
        return this.eventsCategoryService.findAll(active, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get events category by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events category retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Events category not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Events category ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventsCategoryService.findOne(id);
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get events categories by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events categories retrieved successfully' })
    @ApiParam({ name: 'eventId', type: Number, description: 'Event ID' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    async findByEventId(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        return this.eventsCategoryService.findByEventId(eventId, page, limit);
    }

    @Get('category/:categoryId')
    @ApiOperation({ summary: 'Get events categories by category ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events categories retrieved successfully' })
    @ApiParam({ name: 'categoryId', type: Number, description: 'Category ID' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    async findByCategoryId(
        @Param('categoryId', ParseIntPipe) categoryId: number,
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        return this.eventsCategoryService.findByCategoryId(categoryId, page, limit);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new events category' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Events category created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    async create(@Body() createEventsCategoryDto: CreateEventsCategoryDto) {
        return this.eventsCategoryService.create(createEventsCategoryDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update events category by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events category updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Events category not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    @ApiParam({ name: 'id', type: Number, description: 'Events category ID' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEventsCategoryDto: UpdateEventsCategoryDto
    ) {
        return this.eventsCategoryService.update(id, updateEventsCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete events category by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Events category deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Events category not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Events category ID' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventsCategoryService.remove(id);
    }
} 