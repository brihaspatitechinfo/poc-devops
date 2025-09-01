import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../permissions/permissions.decorator';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
@UseGuards(PermissionsGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Get()
  @Permissions('event:view')
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Events retrieved successfully' })
  async findAll(@Query('active') active: boolean, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsService.findAll(active, page, limit);
  }

  @Get(':eventId')
  @Permissions('event:view')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event retrieved successfully' })
  async findOne(@Param('eventId') eventId: number) {
    return this.eventsService.findOne(eventId);
  }

  @Post()
  @Permissions('event:create')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Event created' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Put(':eventId')
  @Permissions('event:edit')
  @ApiOperation({ summary: 'Update event by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event updated' })
  async update(@Param('eventId') eventId: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @Delete(':eventId')
  @Permissions('event:delete')
  @ApiOperation({ summary: 'Delete event by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event deleted successfully' })
  async remove(@Param('eventId') eventId: number) {
    return this.eventsService.remove(eventId);
  }

  @Get('upcoming-events')
  @Permissions('event:view')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Upcoming events retrieved successfully' })
  async upcomingEvents(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsService.upcomingEvents(page, limit);
  }

  @Get('previous-events')
  @Permissions('event:view')
  @ApiOperation({ summary: 'Get previous events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Previous events retrieved successfully' })
  async previousEvents(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsService.previousEvents(page, limit);
  }

  @Get('search')
  @Permissions('event:view')
  @ApiOperation({ summary: 'Search events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Events search results retrieved successfully' })
  async searchEvents(@Query('searchKey') searchKeyword?: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsService.searchEvents(page, limit, searchKeyword);
  }

  @Get('download')
  @Permissions('event:view')
  @ApiOperation({ summary: 'Download event details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event details downloaded successfully' })
  async downloadEvent(@Query('searchKey') searchKeyword?: string, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.eventsService.downloadEvent(page, limit, searchKeyword);
  }

  @Get('event-details')
  @Permissions('event:view')
  @ApiOperation({ summary: 'Get event details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event details retrieved successfully' })
  async eventDetails(@Query('eventId') eventId: number) {
    return this.eventsService.eventDetails(eventId);
  }

}
