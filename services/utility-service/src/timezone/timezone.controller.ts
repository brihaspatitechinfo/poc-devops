import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTimezoneMasterDto } from './dto/create-timezone-master.dto';
import { TimezoneMasterResponseDto } from './dto/timezone-master-response.dto';
import { UpdateTimezoneMasterDto } from './dto/update-timezone-master.dto';
import { TimezoneService } from './timezone.service';

@ApiTags('Timezone Master')
@Controller('timezone-master')
export class TimezoneController {
  constructor(private readonly timezoneService: TimezoneService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new timezone' })
  @ApiResponse({
    status: 201,
    description: 'Timezone created successfully',
    type: TimezoneMasterResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Timezone already exists' })
  async create(@Body() createTimezoneMasterDto: CreateTimezoneMasterDto): Promise<TimezoneMasterResponseDto> {
    return this.timezoneService.create(createTimezoneMasterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timezones with optional filtering' })
  @ApiQuery({ name: 'abbr', required: false, description: 'Filter by timezone abbreviation' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by timezone name or value' })
  @ApiResponse({
    status: 200,
    description: 'List of timezones',
    type: [TimezoneMasterResponseDto]
  })
  async findAll(@Query() query: any): Promise<TimezoneMasterResponseDto[]> {
    return this.timezoneService.findAllWithFilters(query);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default timezone' })
  @ApiResponse({
    status: 200,
    description: 'Default timezone',
    type: TimezoneMasterResponseDto
  })
  @ApiResponse({ status: 404, description: 'Default timezone not found' })
  async getDefault(): Promise<TimezoneMasterResponseDto> {
    return this.timezoneService.getDefaultTimezone();
  }

  @Get(':id/meta')
  @ApiOperation({ summary: 'Get timezone metadata' })
  @ApiParam({ name: 'id', description: 'Timezone ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Timezone metadata', type: TimezoneMasterResponseDto })
  @ApiResponse({ status: 404, description: 'Timezone not found' })
  async getTimezoneMeta(@Param('id', ParseIntPipe) id: number): Promise<TimezoneMasterResponseDto> {
    return this.timezoneService.getTimezoneWithMeta(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a timezone by ID' })
  @ApiParam({ name: 'id', description: 'Timezone ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Timezone details',
    type: TimezoneMasterResponseDto
  })
  @ApiResponse({ status: 404, description: 'Timezone not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TimezoneMasterResponseDto> {
    return this.timezoneService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a timezone' })
  @ApiParam({ name: 'id', description: 'Timezone ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Timezone updated successfully',
    type: TimezoneMasterResponseDto
  })
  @ApiResponse({ status: 404, description: 'Timezone not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Timezone already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTimezoneMasterDto: UpdateTimezoneMasterDto
  ): Promise<TimezoneMasterResponseDto> {
    return this.timezoneService.update(id, updateTimezoneMasterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a timezone' })
  @ApiParam({ name: 'id', description: 'Timezone ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'Timezone deleted successfully' })
  @ApiResponse({ status: 404, description: 'Timezone not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.timezoneService.delete(id);
  }
} 