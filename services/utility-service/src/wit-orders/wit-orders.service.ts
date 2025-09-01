import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWitOrderDto } from './dto/create-wit-order.dto';
import { UpdateWitOrderDto } from './dto/update-wit-order.dto';
import { WitOrderResponseDto } from './dto/wit-order-response.dto';
import { WitOrder } from './entities/wit-orders.entity';

@Injectable()
export class WitOrdersService {
    private readonly logger = new Logger(WitOrdersService.name);

    constructor(
        @InjectRepository(WitOrder)
        private witOrderRepository: Repository<WitOrder>,
    ) { }

    async create(createWitOrderDto: CreateWitOrderDto): Promise<{ statusCode: number; message: string; data?: WitOrderResponseDto }> {
        try {
            const witOrder = this.witOrderRepository.create(createWitOrderDto);
            const savedOrder = await this.witOrderRepository.save(witOrder);

            this.logger.log(`Created wit order with ID: ${savedOrder.id}`);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Wit order created successfully',
                data: this.mapToResponseDto(savedOrder)
            };
        } catch (error) {
            this.logger.error(`Failed to create wit order: ${error.message}`, error.stack);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Order with this order number or order ID already exists');
            }

            throw new InternalServerErrorException('Failed to create wit order');
        }
    }

    async findAll(): Promise<WitOrderResponseDto[]> {
        try {
            const orders = await this.witOrderRepository.find({
                order: { createdAt: 'DESC' }
            });

            this.logger.log(`Retrieved ${orders.length} wit orders`);

            return orders.map(order => this.mapToResponseDto(order));
        } catch (error) {
            this.logger.error(`Error retrieving all wit orders: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve wit orders');
        }
    }

    async findOne(id: number): Promise<WitOrderResponseDto> {
        try {
            // Validate ID
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid order ID provided');
            }

            const order = await this.witOrderRepository.findOne({ where: { id } });

            if (!order) {
                throw new NotFoundException(`Wit order with ID ${id} not found`);
            }

            this.logger.log(`Retrieved wit order with ID: ${id}`);

            return this.mapToResponseDto(order);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(`Error retrieving wit order with ID ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve wit order');
        }
    }

    async findByOrderNum(orderNum: string): Promise<WitOrderResponseDto> {
        try {
            if (!orderNum || orderNum.trim().length === 0) {
                throw new BadRequestException('Invalid order number provided');
            }

            const order = await this.witOrderRepository.findOne({ where: { orderNum } });

            if (!order) {
                throw new NotFoundException(`Wit order with order number ${orderNum} not found`);
            }

            this.logger.log(`Retrieved wit order with order number: ${orderNum}`);

            return this.mapToResponseDto(order);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(`Error retrieving wit order with order number ${orderNum}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve wit order');
        }
    }

    async findByUserId(userId: string): Promise<WitOrderResponseDto[]> {
        try {
            if (!userId || userId.trim().length === 0) {
                throw new BadRequestException('Invalid user ID provided');
            }

            const orders = await this.witOrderRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' }
            });

            this.logger.log(`Retrieved ${orders.length} wit orders for user ID: ${userId}`);

            return orders.map(order => this.mapToResponseDto(order));
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(`Error retrieving wit orders for user ID ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve wit orders for user');
        }
    }

    async update(id: number, updateWitOrderDto: UpdateWitOrderDto): Promise<WitOrderResponseDto> {
        try {
            // Validate ID
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid order ID provided');
            }

            // Check if order exists
            const existingOrder = await this.witOrderRepository.findOne({ where: { id } });
            if (!existingOrder) {
                throw new NotFoundException(`Wit order with ID ${id} not found`);
            }

            // Update the order
            await this.witOrderRepository.update(id, updateWitOrderDto);

            // Fetch updated order
            const updatedOrder = await this.witOrderRepository.findOne({ where: { id } });

            this.logger.log(`Updated wit order with ID: ${id}`);

            return this.mapToResponseDto(updatedOrder);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Order with this order number or order ID already exists');
            }

            this.logger.error(`Failed to update wit order with ID ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to update wit order');
        }
    }

    async remove(id: number): Promise<{ statusCode: number; message: string }> {
        try {
            // Validate ID
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid order ID provided');
            }

            // Check if order exists
            const existingOrder = await this.witOrderRepository.findOne({ where: { id } });
            if (!existingOrder) {
                throw new NotFoundException(`Wit order with ID ${id} not found`);
            }

            await this.witOrderRepository.delete(id);

            this.logger.log(`Deleted wit order with ID: ${id}`);

            return {
                statusCode: HttpStatus.OK,
                message: 'Wit order deleted successfully'
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            this.logger.error(`Failed to delete wit order with ID ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to delete wit order');
        }
    }

    private mapToResponseDto(order: WitOrder): WitOrderResponseDto {
        return {
            id: order.id,
            orderNum: order.orderNum,
            orderId: order.orderId,
            userId: order.userId,
            currencyId: order.currencyId,
            amount: order.amount,
            moneyType: order.moneyType,
            balanceCredit: order.balanceCredit,
            moduleType: order.moduleType,
            moduleId: order.moduleId,
            status: order.status,
            orderMeta: order.orderMeta,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
} 