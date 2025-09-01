import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWitOrderDto } from './dto/create-wit-order.dto';
import { UpdateWitOrderDto } from './dto/update-wit-order.dto';
import { WitOrderResponseDto } from './dto/wit-order-response.dto';
import { WitOrdersService } from './wit-orders.service';

@ApiTags('Wit Orders')
@Controller('wit-orders')
export class WitOrdersController {
    constructor(private readonly witOrdersService: WitOrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new wit order' })
    @ApiResponse({
        status: 201,
        description: 'Wit order created successfully',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 201 },
                message: { type: 'string', example: 'Wit order created successfully' },
                data: { $ref: '#/components/schemas/WitOrderResponseDto' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request - validation error or duplicate order' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async create(@Body() createWitOrderDto: CreateWitOrderDto): Promise<{ statusCode: number; message: string; data?: WitOrderResponseDto }> {
        return this.witOrdersService.create(createWitOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all wit orders' })
    @ApiResponse({
        status: 200,
        description: 'List of wit orders retrieved successfully',
        type: [WitOrderResponseDto]
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findAll(): Promise<WitOrderResponseDto[]> {
        return this.witOrdersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a wit order by ID' })
    @ApiParam({ name: 'id', description: 'Wit order ID', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Wit order retrieved successfully',
        type: WitOrderResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid order ID provided' })
    @ApiResponse({ status: 404, description: 'Wit order not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findOne(@Param('id') id: string): Promise<WitOrderResponseDto> {
        return this.witOrdersService.findOne(+id);
    }

    @Get('order-num/:orderNum')
    @ApiOperation({ summary: 'Get a wit order by order number' })
    @ApiParam({ name: 'orderNum', description: 'Order number', type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'Wit order retrieved successfully',
        type: WitOrderResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid order number provided' })
    @ApiResponse({ status: 404, description: 'Wit order not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findByOrderNum(@Param('orderNum') orderNum: string): Promise<WitOrderResponseDto> {
        return this.witOrdersService.findByOrderNum(orderNum);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all wit orders for a user' })
    @ApiParam({ name: 'userId', description: 'User ID', type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'User wit orders retrieved successfully',
        type: [WitOrderResponseDto]
    })
    @ApiResponse({ status: 400, description: 'Invalid user ID provided' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findByUserId(@Param('userId') userId: string): Promise<WitOrderResponseDto[]> {
        return this.witOrdersService.findByUserId(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a wit order' })
    @ApiParam({ name: 'id', description: 'Wit order ID', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Wit order updated successfully',
        type: WitOrderResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid order ID or validation error' })
    @ApiResponse({ status: 404, description: 'Wit order not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async update(
        @Param('id') id: string,
        @Body() updateWitOrderDto: UpdateWitOrderDto
    ): Promise<WitOrderResponseDto> {
        return this.witOrdersService.update(+id, updateWitOrderDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a wit order' })
    @ApiParam({ name: 'id', description: 'Wit order ID', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Wit order deleted successfully',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Wit order deleted successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Invalid order ID provided' })
    @ApiResponse({ status: 404, description: 'Wit order not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async remove(@Param('id') id: string): Promise<{ statusCode: number; message: string }> {
        return this.witOrdersService.remove(+id);
    }
} 