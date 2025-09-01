import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.coursesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update course by ID' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course by ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor ID' })
  @ApiResponse({ status: 200, description: 'Instructor courses retrieved successfully' })
  async findByInstructor(@Param('instructorId') instructorId: string) {
    return this.coursesService.findByInstructor(instructorId);
  }
}
