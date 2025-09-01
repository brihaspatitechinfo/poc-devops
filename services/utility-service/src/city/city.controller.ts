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
import { CityService } from './city.service';
import { City } from './city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('Cities')
@Controller('utility')
export class CityController {
  private readonly logger = new Logger(CityController.name);

  constructor(private readonly cityService: CityService) {}

  @ApiOperation({ summary: 'Get all cities with optional filtering' })
  @ApiQuery({ name: 'stateId', required: false, description: 'Filter by state ID' })
  @ApiQuery({ name: 'countryId', required: false, description: 'Filter by country ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by city name' })
  @ApiResponse({ status: 200, description: 'Cities retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('cities')
  async findAll(@Query() query: any): Promise<{ success: boolean; data: City[]; message: string }> {
    this.logger.log('GET /utility/cities - Fetching cities with filters');
    const cities = await this.cityService.findAllWithFilters(query);
    return {
      success: true,
      data: cities,
      message: 'Cities fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Get city by ID' })
  @ApiParam({ name: 'id', description: 'City ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'City retrieved successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('cities/:id')
  async findById(@Param('id') id: number): Promise<{ success: boolean; data: City; message: string }> {
    this.logger.log(`GET /utility/cities/${id} - Fetching city by ID`);
    const city = await this.cityService.findById(id);
    return {
      success: true,
      data: city,
      message: 'City fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Post('cities')
  async create(@Body() createCityDto: CreateCityDto): Promise<{ success: boolean; data: City; message: string }> {
    this.logger.log('POST /utility/cities - Creating new city');
    const city = await this.cityService.create(createCityDto);
    return {
      success: true,
      data: city,
      message: 'City created successfully',
    };
  }

  @ApiOperation({ summary: 'Update city by ID' })
  @ApiParam({ name: 'id', description: 'City ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Put('cities/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCityDto: UpdateCityDto,
  ): Promise<{ success: boolean; data: City; message: string }> {
    this.logger.log(`PUT /utility/cities/${id} - Updating city`);
    const city = await this.cityService.update(id, updateCityDto);
    return {
      success: true,
      data: city,
      message: 'City updated successfully',
    };
  }

  @ApiOperation({ summary: 'Delete city by ID' })
  @ApiParam({ name: 'id', description: 'City ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('cities/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/cities/${id} - Deleting city`);
    await this.cityService.delete(id);
    return {
      success: true,
      message: 'City deleted successfully',
    };
  }
} 