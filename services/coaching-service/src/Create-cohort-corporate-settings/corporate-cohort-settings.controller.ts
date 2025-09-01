 import { Controller, Post, Body, HttpStatus, Get, Patch, Param, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CorporateCohortSettingsService } from './corporate-cohort-settings.service';
import { CreateCorporateCohortSettingsDto } from './dto/create-corporate-cohort-settings.dto';
import { WitSelectCorporateCohortSettings } from './entities/wit-select-corporate-cohort-settings.entity';
import { CreateCorporateUnlimitedPricesDto } from './dto/create-corporate-unlimited-prices.dto';
import { WitSelectCorporateUnlimitedPrices } from './entities/wit-select-corporate-unlimited-prices.entity';

@ApiTags('corporate-cohort-settings')
@Controller('corporate-cohort-settings')
export class CorporateCohortSettingsController {
  constructor(private readonly service: CorporateCohortSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Superadmin: Set corporate cohort permissions/settings (with unlimited prices if isUnlimited=1)' })
  @ApiBody({ type: CreateCorporateCohortSettingsDto })
  @ApiResponse({ status: HttpStatus.CREATED , description: 'Settings created (and unlimited prices if provided)', type: WitSelectCorporateCohortSettings })
  async create(@Body() dto: CreateCorporateCohortSettingsDto) {
    const result = await this.service.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Corporate cohort settings created',
      data: result
    };
  }
  @Get()
  @ApiOperation({ summary: 'Get all corporate cohort settings' })
  @ApiResponse({ status: HttpStatus.OK , description: 'List of all cohort settings', type: [WitSelectCorporateCohortSettings] })
  async findAll() {
    const result = await this.service.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'All corporate cohort settings',
      data: result
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific corporate cohort setting by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cohort setting found', type: WitSelectCorporateCohortSettings })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Corporate cohort setting found',
      data: result
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a corporate cohort setting by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateCorporateCohortSettingsDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cohort setting updated', type: WitSelectCorporateCohortSettings })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: Partial<CreateCorporateCohortSettingsDto>) {
    await this.service.update(id, updateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Corporate cohort setting updated'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a corporate cohort setting by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cohort setting deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Corporate cohort setting deleted',
      data: null
    };
  }

  @Get('corporate/unlimited-prices')
  @ApiOperation({ summary: 'Get all corporate unlimited prices' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all price entries',
    type: [WitSelectCorporateUnlimitedPrices],
  })
  async findAllUnlimitedPrices() {
    const result = await this.service.findAllUnlimitedPrices();
    return {
      statusCode: HttpStatus.OK,
      message: 'All corporate unlimited prices',
      data: result
    };
  }
  
  @Get('unlimited-prices/corporate/:corporateId')
  @ApiOperation({ summary: 'Get all prices for a specific corporate' })
  @ApiParam({ name: 'corporateId', type: String, description: 'Corporate ID can be numeric (MySQL) or string (MongoDB ObjectId/UUID)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of prices for the corporate', type: [WitSelectCorporateUnlimitedPrices] })
  async findUnlimitedPricesByCorporateId(@Param('corporateId') corporateId: string): Promise<any> {
    // Handle both numeric and string corporateId values
    const data = await this.service.findUnlimitedPricesByCorporateId(corporateId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Unlimited prices for the corporate',
      data,
    };
  }

  @Get('unlimited-prices/:id')
  @ApiOperation({ summary: 'Get a specific price entry by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Numeric ID for the unlimited price entry' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Price entry found', type: WitSelectCorporateUnlimitedPrices })
  async findUnlimitedPriceOne(@Param('id') id: string): Promise<any> {
    // Convert string ID to number and validate
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('ID must be a valid number');
    }
    
    const data = await this.service.findUnlimitedPriceOne(numericId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Unlimited price entry found',
      data,
    };
  }

}