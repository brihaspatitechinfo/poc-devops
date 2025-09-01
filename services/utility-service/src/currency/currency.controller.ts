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
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';

@ApiTags('Currencies')
@Controller('utility')
export class CurrencyController {
  private readonly logger = new Logger(CurrencyController.name);

  constructor(private readonly currencyService: CurrencyService) {}

  @ApiOperation({ summary: 'Get all currencies with optional filtering' })
  @ApiQuery({ name: 'active', required: false, description: 'Filter by active status (true/false)' })
  @ApiQuery({ name: 'code', required: false, description: 'Filter by currency code' })
  @ApiQuery({ name: 'symbol', required: false, description: 'Filter by currency symbol' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by currency name' })
  @ApiResponse({ status: 200, description: 'Currencies retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('currencies')
  async findAll(@Query() query: any): Promise<{ success: boolean; data: Currency[]; message: string }> {
    this.logger.log('GET /utility/currencies - Fetching currencies with filters');
    const currencies = await this.currencyService.findAllWithFilters(query);
    return {
      success: true,
      data: currencies,
      message: 'Currencies fetched successfully',
    };
  }

  @ApiOperation({ summary: 'Get currency by ID' })
  @ApiParam({ name: 'id', description: 'Currency ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Currency retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('currencies/:id')
  async findById(@Param('id') id: number): Promise<Currency> {
    return await this.currencyService.findById(id);
  }

  @ApiOperation({ summary: 'Create a new currency' })
  @ApiResponse({ status: 201, description: 'Currency created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Post('currencies')
  async create(@Body() createCurrencyDto: Partial<Currency>): Promise<{ success: boolean; data: Currency; message: string }> {
    this.logger.log('POST /utility/currencies - Creating new currency');
    const currency = await this.currencyService.create(createCurrencyDto);
    return {
      success: true,
      data: currency,
      message: 'Currency created successfully',
    };
  }

  @ApiOperation({ summary: 'Update currency by ID' })
  @ApiParam({ name: 'id', description: 'Currency ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Currency updated successfully' })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @Put('currencies/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCurrencyDto: Partial<Currency>,
  ): Promise<{ success: boolean; data: Currency; message: string }> {
    this.logger.log(`PUT /utility/currencies/${id} - Updating currency`);
    const currency = await this.currencyService.update(id, updateCurrencyDto);
    return {
      success: true,
      data: currency,
      message: 'Currency updated successfully',
    };
  }

  @ApiOperation({ summary: 'Delete currency by ID' })
  @ApiParam({ name: 'id', description: 'Currency ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Currency deleted successfully' })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('currencies/:id')
  async delete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/currencies/${id} - Deleting currency`);
    await this.currencyService.delete(id);
    return {
      success: true,
      message: 'Currency deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Soft delete currency by ID' })
  @ApiParam({ name: 'id', description: 'Currency ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Currency soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'Currency not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Delete('currencies/:id/soft')
  async softDelete(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`DELETE /utility/currencies/${id}/soft - Soft deleting currency`);
    await this.currencyService.softDelete(id);
    return {
      success: true,
      message: 'Currency soft deleted successfully',
    };
  }
} 