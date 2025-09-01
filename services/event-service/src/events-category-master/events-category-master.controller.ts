import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventsCategoryMasterDto } from './dto/create-events-category-master.dto';
import { UpdateEventsCategoryMasterDto } from './dto/update-events-category-master.dto';
import { EventsCategoryMasterService } from './events-category-master.service';

@ApiTags('Events Category Master')
@Controller('events-category-master')
export class EventsCategoryMasterController {
    constructor(private readonly eventsCategoryMasterService: EventsCategoryMasterService) { }

    @Get()
    @ApiOperation({ summary: 'Get all event categories' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event categories retrieved successfully' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
      async findAll(@Query('active') active = true, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsCategoryMasterService.findAll(active, page, limit);
  }

    @Get(':id')
    @ApiOperation({ summary: 'Get event category by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event category retrieved successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event category not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Event category ID' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventsCategoryMasterService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new event category' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event category created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    async create(@Body() createEventsCategoryMasterDto: CreateEventsCategoryMasterDto) {
        return this.eventsCategoryMasterService.create(createEventsCategoryMasterDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update event category by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event category updated successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event category not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
    @ApiParam({ name: 'id', type: Number, description: 'Event category ID' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEventsCategoryMasterDto: UpdateEventsCategoryMasterDto
    ) {
        return this.eventsCategoryMasterService.update(id, updateEventsCategoryMasterDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event category by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event category deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event category not found' })
    @ApiParam({ name: 'id', type: Number, description: 'Event category ID' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventsCategoryMasterService.remove(id);
    }
} 