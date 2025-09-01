import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@ApiTags('assessments')
@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assessments with pagination' })
  @ApiResponse({ status: 200, description: 'List of assessments' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.assessmentsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment by ID' })
  @ApiResponse({ status: 200, description: 'Assessment details' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new assessment' })
  @ApiResponse({ status: 201, description: 'Assessment created successfully' })
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an assessment' })
  @ApiResponse({ status: 200, description: 'Assessment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
    return this.assessmentsService.update(id, updateAssessmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assessment' })
  @ApiResponse({ status: 200, description: 'Assessment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit an assessment' })
  @ApiResponse({ status: 201, description: 'Assessment submitted successfully' })
  submitAssessment(@Param('id') id: string, @Body() submitDto: SubmitAssessmentDto) {
    return this.assessmentsService.submitAssessment(id, submitDto);
  }

  @Get(':id/submissions')
  @ApiOperation({ summary: 'Get all submissions for an assessment' })
  @ApiResponse({ status: 200, description: 'List of submissions' })
  getSubmissions(@Param('id') id: string) {
    return this.assessmentsService.getSubmissions(id);
  }

  @Get('user/:userId/results')
  @ApiOperation({ summary: 'Get user assessment results' })
  @ApiResponse({ status: 200, description: 'User assessment results' })
  getUserResults(@Param('userId') userId: string) {
    return this.assessmentsService.getUserResults(userId);
  }
} 