import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EngagementService } from './engagement.service';
import { CreateEngagementDto } from './dto/create-engagement.dto';

@ApiTags('Engagement')
@Controller('engagement')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create engagement record' })
  @ApiResponse({ status: 201, description: 'Engagement created successfully' })
  create(@Body() createEngagementDto: CreateEngagementDto) {
    return this.engagementService.create(createEngagementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all engagement records with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of engagement records' })
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.engagementService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get engagement record by ID' })
  @ApiParam({ name: 'id', description: 'Engagement ID' })
  @ApiResponse({ status: 200, description: 'Engagement record details' })
  @ApiResponse({ status: 404, description: 'Engagement record not found' })
  findOne(@Param('id') id: string) {
    return this.engagementService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get engagement records by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User engagement records' })
  findByUserId(@Param('userId') userId: string) {
    return this.engagementService.findByUserId(userId);
  }

  @Get('user/:userId/score')
  @ApiOperation({ summary: 'Get user engagement score' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User engagement score' })
  getEngagementScore(@Param('userId') userId: string) {
    return this.engagementService.getEngagementScore(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update engagement record' })
  @ApiParam({ name: 'id', description: 'Engagement ID' })
  @ApiResponse({ status: 200, description: 'Engagement updated successfully' })
  @ApiResponse({ status: 404, description: 'Engagement not found' })
  update(@Param('id') id: string, @Body() updateEngagementDto: Partial<CreateEngagementDto>) {
    return this.engagementService.update(id, updateEngagementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete engagement record' })
  @ApiParam({ name: 'id', description: 'Engagement ID' })
  @ApiResponse({ status: 200, description: 'Engagement deleted successfully' })
  @ApiResponse({ status: 404, description: 'Engagement not found' })
  remove(@Param('id') id: string) {
    return this.engagementService.remove(id);
  }
} 