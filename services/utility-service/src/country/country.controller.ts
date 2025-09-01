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
import { CountryService } from './country.service';
import { Country } from './country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiTags('Countries')
@Controller('country')
export class CountryController {
  private readonly logger = new Logger(CountryController.name);

  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ summary: 'Get all countries with optional filtering' })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status (true/false)' })
  @ApiQuery({ name: 'shortname', required: false, description: 'Filter by country shortname' })
  @ApiQuery({ name: 'dialCode', required: false, description: 'Filter by dial code' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by country name' })
  @ApiResponse({ status: 200, description: 'Countries retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('countries')
  async findAll(@Query() query: any): Promise<{ success: boolean; data: Country[]; message: string }> {
    this.logger.log('GET /utility/countries - Fetching countries with filters');
    const countries = await this.countryService.findAllWithFilters(query);
    return {
      success: true,
      data: countries,
      message: 'Countries fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Country retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('countries/:id')
  async findById(@Param('id') id: number): Promise<{ success: boolean; data: Country; message: string }> {
    this.logger.log(`GET /utility/countries/${id} - Fetching country by ID`);
    const country = await this.countryService.findById(id);
    return {
      success: true,
      data: country,
      message: 'Country fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Update country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Country updated successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Put('countries/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<{ success: boolean; data: Country; message: string }> {
    this.logger.log(`PUT /utility/countries/${id} - Updating country`);
    const country = await this.countryService.update(id, updateCountryDto as unknown as Partial<Country>);
    return {
      success: true,
      data: country,
      message: 'Country updated successfully',
    };
  }

  @ApiOperation({ summary: 'Delete country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('countries/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/countries/${id} - Deleting country`);
    await this.countryService.delete(id);
    return {
      success: true,
      message: 'Country deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Soft delete country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Country soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('countries/:id/soft')
  async softDelete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/countries/${id}/soft - Soft deleting country`);
    await this.countryService.softDelete(id);
    return {
      success: true,
      message: 'Country soft deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Get country by dial code' })
  @ApiParam({ name: 'dialCode', description: 'Country dial code', type: 'string' })
  @ApiResponse({ status: 200, description: 'Country retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/dial-code/:dialCode')
  async dialCodeToCountry(@Param('dialCode') dialCode: number): Promise<Country> {
    return await this.countryService.dialCodeToCountry(dialCode); 
  }

}