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
import { LocationMasterService } from './location-master.service';
import { LocationMaster } from './location-master.entity';

@ApiTags('Locations')
@Controller('utility')
export class LocationMasterController {
  private readonly logger = new Logger(LocationMasterController.name);

  constructor(private readonly locationMasterService: LocationMasterService) {}

  @ApiOperation({ summary: 'Get all locations with optional filtering' })
  @ApiQuery({ name: 'countryId', required: false, description: 'Filter by country ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by location name' })
  @ApiQuery({ name: 'ids', required: false, description: 'Comma-separated location IDs (e.g., 1,2,3)' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('locations')
  async findAll(@Query() query: any): Promise<{ success: boolean; data: LocationMaster[]; message: string }> {
    this.logger.log('GET /utility/locations - Fetching locations with filters');
    const locations = await this.locationMasterService.findAllWithFilters(query);
    return {
      success: true,
      data: locations,
      message: 'Locations fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Get location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Location retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('locations/:id')
  async findById(@Param('id') id: number): Promise<{ success: boolean; data: LocationMaster; message: string }> {
    this.logger.log(`GET /utility/locations/${id} - Fetching location by ID`);
    const location = await this.locationMasterService.findById(id);
    return {
      success: true,
      data: location,
      message: 'Location fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Post('locations')
  async create(@Body() createLocationDto: Partial<LocationMaster>): Promise<{ success: boolean; data: LocationMaster; message: string }> {
    this.logger.log('POST /utility/locations - Creating new location');
    const location = await this.locationMasterService.create(createLocationDto);
    return {
      success: true,
      data: location,
      message: 'Location created successfully',
    };
  }

  @ApiOperation({ summary: 'Update location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Put('locations/:id')
  async update(
    @Param('id') id: number,
    @Body() updateLocationDto: Partial<LocationMaster>,
  ): Promise<{ success: boolean; data: LocationMaster; message: string }> {
    this.logger.log(`PUT /utility/locations/${id} - Updating location`);
    const location = await this.locationMasterService.update(id, updateLocationDto);
    return {
      success: true,
      data: location,
      message: 'Location updated successfully',
    };
  }

  @ApiOperation({ summary: 'Delete location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('locations/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/locations/${id} - Deleting location`);
    await this.locationMasterService.delete(id);
    return {
      success: true,
      message: 'Location deleted successfully',
    };
  }
} 