import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEventTagMasterDto } from './dto/create-event-tag-master.dto';
import { UpdateEventTagMasterDto } from './dto/update-event-tag-master.dto';
import { EventTagMaster } from './entities/event-tag-master.entity';
import { EventTagMasterService } from './event-tag-master.service';

@ApiTags('Event Tag Master')
@Controller('event-tag-master')
export class EventTagMasterController {
    constructor(private readonly eventTagMasterService: EventTagMasterService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event tag master' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event tag master created successfully', type: EventTagMaster })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Tag already exists' })
    create(@Body() createEventTagMasterDto: CreateEventTagMasterDto): Promise<EventTagMaster> {
        return this.eventTagMasterService.create(createEventTagMasterDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event tag masters with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'tag', required: false, type: String, description: 'Filter by tag name (partial match)' })
    @ApiQuery({ name: 'isPreferred', required: false, type: Boolean, description: 'Filter by preferred status' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of event tag masters' })
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('tag') tag?: string,
        @Query('isPreferred', new DefaultValuePipe(undefined)) isPreferred?: boolean,
    ) {
        return this.eventTagMasterService.findAll(page, limit, tag, isPreferred);
    }

    @Get('preferred')
    @ApiOperation({ summary: 'Get all preferred event tag masters' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of preferred event tag masters', type: [EventTagMaster] })
    findPreferred(): Promise<EventTagMaster[]> {
        return this.eventTagMasterService.findPreferred();
    }

    @Get('search/:tag')
    @ApiOperation({ summary: 'Search event tag masters by tag name' })
    @ApiParam({ name: 'tag', description: 'Tag name to search for' })
    @ApiResponse({ status: HttpStatus.OK, description: 'List of matching event tag masters', type: [EventTagMaster] })
    findByTag(@Param('tag') tag: string): Promise<EventTagMaster[]> {
        return this.eventTagMasterService.findByTag(tag);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event tag master by ID' })
    @ApiParam({ name: 'id', description: 'Event tag master ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag master found', type: EventTagMaster })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event tag master not found' })
    findOne(@Param('id', ParseIntPipe) id: number): Promise<EventTagMaster> {
        return this.eventTagMasterService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event tag master by ID' })
    @ApiParam({ name: 'id', description: 'Event tag master ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag master updated successfully', type: EventTagMaster })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event tag master not found' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Tag already exists' })
    update(@Param('id', ParseIntPipe) id: number , @Body() updateEventTagMasterDto: UpdateEventTagMasterDto): Promise<EventTagMaster> {
        return this.eventTagMasterService.update(id, updateEventTagMasterDto);
    }

    @Patch(':id/toggle-preferred')
    @ApiOperation({ summary: 'Toggle preferred status of event tag master' })
    @ApiParam({ name: 'id', description: 'Event tag master ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Preferred status toggled successfully', type: EventTagMaster })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event tag master not found' })
    togglePreferred(@Param('id', ParseIntPipe) id: number): Promise<EventTagMaster> {
        return this.eventTagMasterService.togglePreferred(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event tag master by ID' })
    @ApiParam({ name: 'id', description: 'Event tag master ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event tag master deleted successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event tag master not found' })
    remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.eventTagMasterService.remove(id);
    }
} 