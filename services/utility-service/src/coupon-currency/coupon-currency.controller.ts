import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CouponCurrencyService } from './coupon-currency.service';
import { CouponCurrencyResponseDto } from './dto/coupon-currency-response.dto';
import { CreateCouponCurrencyDto } from './dto/create-coupon-currency.dto';
import { UpdateCouponCurrencyDto } from './dto/update-coupon-currency.dto';

@ApiTags('Coupon Currency')
@Controller('coupon-currency')
export class CouponCurrencyController {
    constructor(private readonly couponCurrencyService: CouponCurrencyService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new coupon currency' })
    @ApiResponse({
        status: 201,
        description: 'Coupon currency created successfully',
        type: CouponCurrencyResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid data',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - Coupon currency combination already exists',
    })
    async create(@Body(ValidationPipe) createCouponCurrencyDto: CreateCouponCurrencyDto): Promise<CouponCurrencyResponseDto> {
        return this.couponCurrencyService.create(createCouponCurrencyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all coupon currencies with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'couponId', required: false, type: Number, description: 'Filter by coupon ID' })
    @ApiQuery({ name: 'currencyId', required: false, type: Number, description: 'Filter by currency ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon currencies retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CouponCurrencyResponseDto' },
                },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
            },
        },
    })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('couponId') couponId?: number,
        @Query('currencyId') currencyId?: number,
    ) {
        return this.couponCurrencyService.findAll(page, limit, couponId, currencyId);
    }

    @Get('coupon/:couponId')
    @ApiOperation({ summary: 'Get all coupon currencies by coupon ID' })
    @ApiParam({ name: 'couponId', description: 'Coupon ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon currencies retrieved successfully',
        type: [CouponCurrencyResponseDto],
    })
    @ApiResponse({
        status: 404,
        description: 'No coupon currencies found for the given coupon ID',
    })
    async findByCouponId(@Param('couponId', ParseIntPipe) couponId: number): Promise<CouponCurrencyResponseDto[]> {
        return this.couponCurrencyService.findByCouponId(couponId);
    }

    @Get('currency/:currencyId')
    @ApiOperation({ summary: 'Get all coupon currencies by currency ID' })
    @ApiParam({ name: 'currencyId', description: 'Currency ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon currencies retrieved successfully',
        type: [CouponCurrencyResponseDto],
    })
    @ApiResponse({
        status: 404,
        description: 'No coupon currencies found for the given currency ID',
    })
    async findByCurrencyId(@Param('currencyId', ParseIntPipe) currencyId: number): Promise<CouponCurrencyResponseDto[]> {
        return this.couponCurrencyService.findByCurrencyId(currencyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a coupon currency by ID' })
    @ApiParam({ name: 'id', description: 'Coupon currency ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon currency retrieved successfully',
        type: CouponCurrencyResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon currency not found',
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CouponCurrencyResponseDto> {
        return this.couponCurrencyService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a coupon currency' })
    @ApiParam({ name: 'id', description: 'Coupon currency ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon currency updated successfully',
        type: CouponCurrencyResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon currency not found',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - Coupon currency combination already exists',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateCouponCurrencyDto: UpdateCouponCurrencyDto,
    ): Promise<CouponCurrencyResponseDto> {
        return this.couponCurrencyService.update(id, updateCouponCurrencyDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a coupon currency' })
    @ApiParam({ name: 'id', description: 'Coupon currency ID' })
    @ApiResponse({
        status: 204,
        description: 'Coupon currency deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon currency not found',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.couponCurrencyService.remove(id);
    }

    @Delete('coupon/:couponId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete all coupon currencies by coupon ID' })
    @ApiParam({ name: 'couponId', description: 'Coupon ID' })
    @ApiResponse({
        status: 204,
        description: 'Coupon currencies deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'No coupon currencies found for the given coupon ID',
    })
    async removeByCouponId(@Param('couponId', ParseIntPipe) couponId: number): Promise<{ message: string }> {
        return this.couponCurrencyService.removeByCouponId(couponId);
    }
} 