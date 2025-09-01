import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all coaching sessions' })
  @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.sessionsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new coaching session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.create(createSessionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update session by ID' })
  @ApiResponse({ status: 200, description: 'Session updated successfully' })
  async update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel session by ID' })
  @ApiResponse({ status: 200, description: 'Session cancelled successfully' })
  async remove(@Param('id') id: string) {
    return this.sessionsService.remove(id);
  }

  @Get('coach/:coachId')
  @ApiOperation({ summary: 'Get sessions by coach ID' })
  @ApiResponse({ status: 200, description: 'Coach sessions retrieved successfully' })
  async findByCoach(@Param('coachId') coachId: string) {
    return this.sessionsService.findByCoach(coachId);
  }

  @Get('coachee/:coacheeId')
  @ApiOperation({ summary: 'Get sessions by coachee ID' })
  @ApiResponse({ status: 200, description: 'Coachee sessions retrieved successfully' })
  async findByCoachee(@Param('coacheeId') coacheeId: string) {
    return this.sessionsService.findByCoachee(coacheeId);
  }
}
