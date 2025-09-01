import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateEventTeamDto } from './dto/create-event-team.dto';
import { UpdateEventTeamDto } from './dto/update-event-team.dto';
import { EventTeamsService } from './event-teams.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('event-teams')
export class EventTeamsController {
    constructor(private readonly eventTeamsService: EventTeamsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event team' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event team created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventTeamDto: CreateEventTeamDto) {
        return this.eventTeamsService.create(createEventTeamDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple event teams' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event teams created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    bulkCreate(@Body() teams: CreateEventTeamDto[]) {
        return this.eventTeamsService.bulkCreate(teams);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event teams' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventTeamsService.findAll();
    }

    @Get('team/:teamId')
    @ApiOperation({ summary: 'Get event teams by team ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByTeamId(@Param('teamId', ParseIntPipe) teamId: number) {
        return this.eventTeamsService.findByTeamId(teamId);
    }

    @Get('name/:teamName')
    @ApiOperation({ summary: 'Get event teams by team name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByTeamName(@Param('teamName') teamName: string) {
        return this.eventTeamsService.findByTeamName(teamName);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search event teams by team name' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    searchByTeamName(@Query('q') searchTerm: string) {
        return this.eventTeamsService.searchByTeamName(searchTerm);
    }

    @Get('team-ids')
    @ApiOperation({ summary: 'Get all team IDs' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Team IDs retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findTeamIds() {
        return this.eventTeamsService.findTeamIds();
    }

    @Get('team-names')
    @ApiOperation({ summary: 'Get all team names' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Team names retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findTeamNames() {
        return this.eventTeamsService.findTeamNames();
    }

    @Get('with-video')
    @ApiOperation({ summary: 'Get event teams with video' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findTeamsWithVideo() {
        return this.eventTeamsService.findTeamsWithVideo();
    }

    @Get('with-document')
    @ApiOperation({ summary: 'Get event teams with document' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findTeamsWithDocument() {
        return this.eventTeamsService.findTeamsWithDocument();
    }

    @Get('with-display-image')
    @ApiOperation({ summary: 'Get event teams with display image' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findTeamsWithDisplayImage() {
        return this.eventTeamsService.findTeamsWithDisplayImage();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event team by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event team retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventTeamsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event team by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event team updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventTeamDto: UpdateEventTeamDto) {
        return this.eventTeamsService.update(id, updateEventTeamDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event team by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event team deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventTeamsService.remove(id);
    }

    @Delete('team/:teamId')
    @ApiOperation({ summary: 'Delete event teams by team ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event teams deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    removeByTeamId(@Param('teamId', ParseIntPipe) teamId: number) {
        return this.eventTeamsService.removeByTeamId(teamId);
    }
} 