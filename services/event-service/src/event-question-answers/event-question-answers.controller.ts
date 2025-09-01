import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventQuestionAnswerDto } from './dto/create-event-question-answer.dto';
import { UpdateEventQuestionAnswerDto } from './dto/update-event-question-answer.dto';
import { EventQuestionAnswersService } from './event-question-answers.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('event-question-answers')
export class EventQuestionAnswersController {
    constructor(private readonly eventQuestionAnswersService: EventQuestionAnswersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new event question answer' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event question answer created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    create(@Body() createEventQuestionAnswerDto: CreateEventQuestionAnswerDto) {
        return this.eventQuestionAnswersService.create(createEventQuestionAnswerDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Create multiple event question answers' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Event question answers created successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    bulkCreate(@Body() answers: CreateEventQuestionAnswerDto[]) {
        return this.eventQuestionAnswersService.bulkCreate(answers);
    }

    @Get()
    @ApiOperation({ summary: 'Get all event question answers' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findAll() {
        return this.eventQuestionAnswersService.findAll();
    }

    @Get('event/:eventId')
    @ApiOperation({ summary: 'Get event question answers by event ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventId(@Param('eventId', ParseIntPipe) eventId: number) {
        return this.eventQuestionAnswersService.findByEventId(eventId);
    }

    @Get('candidate/:candidateId')
    @ApiOperation({ summary: 'Get event question answers by candidate ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByCandidateId(@Param('candidateId', ParseIntPipe) candidateId: number) {
        return this.eventQuestionAnswersService.findByCandidateId(candidateId);
    }

    @Get('event/:eventId/candidate/:candidateId')
    @ApiOperation({ summary: 'Get event question answers by event ID and candidate ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answers retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findByEventAndCandidate(
        @Param('eventId', ParseIntPipe) eventId: number,
        @Param('candidateId', ParseIntPipe) candidateId: number
    ) {
        return this.eventQuestionAnswersService.findByEventAndCandidate(eventId, candidateId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event question answer by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answer retrieved successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventQuestionAnswersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update event question answer by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answer updated successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventQuestionAnswerDto: UpdateEventQuestionAnswerDto) {
        return this.eventQuestionAnswersService.update(id, updateEventQuestionAnswerDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete event question answer by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Event question answer deleted successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventQuestionAnswersService.remove(id);
    }
} 