import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventQuestionDto } from './dto/create-event-question.dto';
import { UpdateEventQuestionDto } from './dto/update-event-question.dto';
import { EventQuestionsService } from './event-questions.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('event-questions')
export class EventQuestionsController {
    constructor(private readonly eventQuestionsService: EventQuestionsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event question' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event question created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventQuestionDto: CreateEventQuestionDto) {
        return this.eventQuestionsService.create(createEventQuestionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event questions' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event questions retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventQuestionsService.findAll();
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event questions by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event questions retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventQuestionsService.findByEventId(eventId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventQuestionsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event question by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventQuestionDto: UpdateEventQuestionDto) {
        return this.eventQuestionsService.update(id, updateEventQuestionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event question by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventQuestionsService.remove(id);
    }
} 