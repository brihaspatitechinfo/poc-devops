import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StateService } from './state.service';
import { State } from './state.entity';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@ApiTags('States')
@Controller('utility')
export class StateController {
  private readonly logger = new Logger(StateController.name);

  constructor(private readonly stateService: StateService) {}

  @ApiOperation({ summary: 'Get all states with optional filtering' })
  @ApiQuery({ name: 'countryId', required: false, description: 'Filter by country ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by state name' })
  @ApiResponse({ status: 200, description: 'States retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('states')
  async findAll(@Query() query: any): Promise<{ success: boolean; data: State[]; message: string }> {
    this.logger.log('GET /utility/states - Fetching states with filters');
    const states = await this.stateService.findAllWithFilters(query);
    return {
      success: true,
      data: states,
      message: 'States fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Get state by ID' })
  @ApiParam({ name: 'id', description: 'State ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'State retrieved successfully' })
  @ApiResponse({ status: 404, description: 'State not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('states/:id')
  async findById(@Param('id') id: number): Promise<{ success: boolean; data: State; message: string }> {
    this.logger.log(`GET /utility/states/${id} - Fetching state by ID`);
    const state = await this.stateService.findById(id);
    return {
      success: true,
      data: state,
      message: 'State fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Create a new state' })
  @ApiResponse({ status: 201, description: 'State created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Post('states')
  async create(@Body() createStateDto: CreateStateDto): Promise<{ success: boolean; data: State; message: string }> {
    this.logger.log('POST /utility/states - Creating new state');
    const state = await this.stateService.create(createStateDto);
    return {
      success: true,
      data: state,
      message: 'State created successfully',
    };
  }

  @ApiOperation({ summary: 'Update state by ID' })
  @ApiParam({ name: 'id', description: 'State ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'State updated successfully' })
  @ApiResponse({ status: 404, description: 'State not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Put('states/:id')
  async update(
    @Param('id') id: number,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<{ success: boolean; data: State; message: string }> {
    this.logger.log(`PUT /utility/states/${id} - Updating state`);
    const state = await this.stateService.update(id, updateStateDto);
    return {
      success: true,
      data: state,
      message: 'State updated successfully',
    };
  }

  @ApiOperation({ summary: 'Delete state by ID' })
  @ApiParam({ name: 'id', description: 'State ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'State deleted successfully' })
  @ApiResponse({ status: 404, description: 'State not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('states/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/states/${id} - Deleting state`);
    await this.stateService.delete(id);
    return {
      success: true,
      message: 'State deleted successfully',
    };
  }
} 