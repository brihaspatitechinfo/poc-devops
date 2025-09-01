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
import { CouponsService } from './coupons.service';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new coupon' })
    @ApiResponse({
        status: 201,
        description: 'Coupon created successfully',
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid data or expiry date in the past',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - Coupon code already exists',
    })
    async create(@Body(ValidationPipe) createCouponDto: CreateCouponDto): Promise<CouponResponseDto> {
        return this.couponsService.create(createCouponDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all coupons with pagination and filtering' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by coupon label' })
    @ApiQuery({ name: 'status', required: false, type: Number, description: 'Filter by status (0=inactive, 1=active)' })
    @ApiQuery({ name: 'couponType', required: false, type: Number, description: 'Filter by coupon type (1=Individual, 2=Corporate, 3=All)' })
    @ApiResponse({
        status: 200,
        description: 'Coupons retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CouponResponseDto' },
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
        @Query('search') search?: string,
        @Query('status') status?: number,
        @Query('couponType') couponType?: number,
    ) {
        return this.couponsService.findAll(page, limit, search, status, couponType);
    }

    @Get('active')
    @ApiOperation({ summary: 'Get all active coupons' })
    @ApiResponse({
        status: 200,
        description: 'Active coupons retrieved successfully',
        type: [CouponResponseDto],
    })
    async getActiveCoupons(): Promise<CouponResponseDto[]> {
        return this.couponsService.getActiveCoupons();
    }

    @Get('expired')
    @ApiOperation({ summary: 'Get all expired coupons' })
    @ApiResponse({
        status: 200,
        description: 'Expired coupons retrieved successfully',
        type: [CouponResponseDto],
    })
    async getExpiredCoupons(): Promise<CouponResponseDto[]> {
        return this.couponsService.getExpiredCoupons();
    }

    @Get('type/:couponType')
    @ApiOperation({ summary: 'Get coupons by type' })
    @ApiParam({ name: 'couponType', description: 'Coupon type (1=Individual, 2=Corporate, 3=All)' })
    @ApiResponse({
        status: 200,
        description: 'Coupons by type retrieved successfully',
        type: [CouponResponseDto],
    })
    async getCouponsByType(@Param('couponType', ParseIntPipe) couponType: number): Promise<CouponResponseDto[]> {
        return this.couponsService.getCouponsByType(couponType);
    }

    @Get('validate/:code')
    @ApiOperation({ summary: 'Validate a coupon code' })
    @ApiParam({ name: 'code', description: 'Coupon code to validate' })
    @ApiQuery({ name: 'userDomain', required: false, type: String, description: 'User company domain for corporate coupons' })
    @ApiResponse({
        status: 200,
        description: 'Coupon validation result',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean' },
                message: { type: 'string' },
                coupon: { $ref: '#/components/schemas/CouponResponseDto' },
            },
        },
    })
    async validateCoupon(
        @Param('code') code: string,
        @Query('userDomain') userDomain?: string,
    ) {
        return this.couponsService.validateCoupon(code, userDomain);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a coupon by ID' })
    @ApiParam({ name: 'id', description: 'Coupon ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon retrieved successfully',
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon not found',
    })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CouponResponseDto> {
        return this.couponsService.findOne(id);
    }

    @Get('code/:code')
    @ApiOperation({ summary: 'Get a coupon by code' })
    @ApiParam({ name: 'code', description: 'Coupon code' })
    @ApiResponse({
        status: 200,
        description: 'Coupon retrieved successfully',
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon not found',
    })
    async findByCode(@Param('code') code: string): Promise<CouponResponseDto> {
        return this.couponsService.findByCode(code);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a coupon' })
    @ApiParam({ name: 'id', description: 'Coupon ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon updated successfully',
        type: CouponResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid data or expiry date in the past',
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon not found',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - Coupon code already exists',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateCouponDto: UpdateCouponDto,
    ): Promise<CouponResponseDto> {
        return this.couponsService.update(id, updateCouponDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a coupon' })
    @ApiParam({ name: 'id', description: 'Coupon ID' })
    @ApiResponse({
        status: 200,
        description: 'Coupon deleted successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Coupon deleted successfully' },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Coupon not found',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.couponsService.remove(id);
    }
} 