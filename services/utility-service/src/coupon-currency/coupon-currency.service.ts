import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CouponCurrency } from './coupon-currency.entity';
import { CouponCurrencyResponseDto } from './dto/coupon-currency-response.dto';
import { CreateCouponCurrencyDto } from './dto/create-coupon-currency.dto';
import { UpdateCouponCurrencyDto } from './dto/update-coupon-currency.dto';

@Injectable()
export class CouponCurrencyService {
    constructor(@InjectRepository(CouponCurrency) private readonly couponCurrencyRepository: Repository<CouponCurrency>) { }

    async create(createCouponCurrencyDto: CreateCouponCurrencyDto): Promise<CouponCurrencyResponseDto> {
        try {
    
            // Check if coupon currency combination already exists
            const existingCouponCurrency = await this.couponCurrencyRepository.findOne({
                where: {
                    couponId: createCouponCurrencyDto.couponId,
                    currencyId: createCouponCurrencyDto.currencyId
                }
            });

            if (existingCouponCurrency) {
                throw new ConflictException('Coupon currency combination already exists');
            }

            const couponCurrency = this.couponCurrencyRepository.create(createCouponCurrencyDto);
            const savedCouponCurrency = await this.couponCurrencyRepository.save(couponCurrency);
            return this.mapToResponseDto(savedCouponCurrency);
        } catch (error) {
            if (error instanceof ConflictException || error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to create coupon currency: ${error.message}`);
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        couponId?: number,
        currencyId?: number,
    ): Promise<{ data: CouponCurrencyResponseDto[]; total: number; page: number; limit: number }> {
        try {
    
            const skip = (page - 1) * limit;
            const whereConditions: FindOptionsWhere<CouponCurrency> = {};

            if (couponId !== undefined) {
                whereConditions.couponId = couponId;
            }

            if (currencyId !== undefined) {
                whereConditions.currencyId = currencyId;
            }

            const [couponCurrencies, total] = await this.couponCurrencyRepository.findAndCount({
                where: whereConditions,
                relations: ['currency', 'coupon'],
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            return {
                data: couponCurrencies.map(couponCurrency => this.mapToResponseDto(couponCurrency)),
                total,
                page,
                limit,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to fetch coupon currencies: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<CouponCurrencyResponseDto> {
        try {
         
            const couponCurrency = await this.couponCurrencyRepository.findOne({
                where: { id },
                relations: ['currency', 'coupon']
            });

            if (!couponCurrency) {
                throw new NotFoundException(`Coupon currency with ID ${id} not found`);
            }

            return this.mapToResponseDto(couponCurrency);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to fetch coupon currency with ID ${id}: ${error.message}`);
        }
    }

    async findByCouponId(couponId: number): Promise<CouponCurrencyResponseDto[]> {
        try {
         
            const couponCurrencies = await this.couponCurrencyRepository.find({
                where: { couponId },
                relations: ['currency', 'coupon'],
                order: { createdAt: 'DESC' }
            });

            return couponCurrencies.map(couponCurrency => this.mapToResponseDto(couponCurrency));
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to fetch coupon currencies for coupon ID ${couponId}: ${error.message}`);
        }
    }

    async findByCurrencyId(currencyId: number): Promise<CouponCurrencyResponseDto[]> {
        try {
          
            const couponCurrencies = await this.couponCurrencyRepository.find({
                where: { currencyId },
                relations: ['currency', 'coupon'],
                order: { createdAt: 'DESC' }
            });

            return couponCurrencies.map(couponCurrency => this.mapToResponseDto(couponCurrency));
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to fetch coupon currencies for currency ID ${currencyId}: ${error.message}`);
        }
    }

    async update(id: number, updateCouponCurrencyDto: UpdateCouponCurrencyDto): Promise<CouponCurrencyResponseDto> {
        try {
            
            if (updateCouponCurrencyDto.value !== undefined) {
                if (typeof updateCouponCurrencyDto.value !== 'number' || updateCouponCurrencyDto.value < 0) {
                    throw new BadRequestException('Value must be a non-negative number');
                }
            }

            const couponCurrency = await this.couponCurrencyRepository.findOne({
                where: { id }
            });

            if (!couponCurrency) {
                throw new NotFoundException(`Coupon currency with ID ${id} not found`);
            }

            // Check if the new combination already exists (if updating couponId or currencyId)
            if (updateCouponCurrencyDto.couponId || updateCouponCurrencyDto.currencyId) {
                const newCouponId = updateCouponCurrencyDto.couponId || couponCurrency.couponId;
                const newCurrencyId = updateCouponCurrencyDto.currencyId || couponCurrency.currencyId;

                const existingCouponCurrency = await this.couponCurrencyRepository.findOne({
                    where: {
                        couponId: newCouponId,
                        currencyId: newCurrencyId,
                        id: { $ne: id } as any
                    }
                });

                if (existingCouponCurrency) {
                    throw new ConflictException('Coupon currency combination already exists');
                }
            }

            Object.assign(couponCurrency, updateCouponCurrencyDto);
            const updatedCouponCurrency = await this.couponCurrencyRepository.save(couponCurrency);
            return this.mapToResponseDto(updatedCouponCurrency);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Failed to update coupon currency with ID ${id}: ${error.message}`);
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
          
            const couponCurrency = await this.couponCurrencyRepository.findOne({
                where: { id }
            });

            if (!couponCurrency) {
                throw new NotFoundException(`Coupon currency with ID ${id} not found`);
            }

            await this.couponCurrencyRepository.remove(couponCurrency);
            return { message: 'Coupon currency deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to delete coupon currency with ID ${id}: ${error.message}`);
        }
    }

    async removeByCouponId(couponId: number): Promise<{ message: string }> {
        try {

            const couponCurrencies = await this.couponCurrencyRepository.find({
                where: { couponId }
            });

            if (couponCurrencies.length === 0) {
                throw new NotFoundException(`No coupon currencies found for coupon ID ${couponId}`);
            }

            await this.couponCurrencyRepository.remove(couponCurrencies);
            return { message: `Deleted ${couponCurrencies.length} coupon currency records for coupon ID ${couponId}` };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to delete coupon currencies for coupon ID ${couponId}: ${error.message}`);
        }
    }

    private mapToResponseDto(couponCurrency: CouponCurrency): CouponCurrencyResponseDto {
        try {
            if (!couponCurrency) {
                throw new Error('Coupon currency entity is required for mapping');
            }

            return {
                id: couponCurrency.id,
                currencyId: couponCurrency.currencyId,
                couponId: couponCurrency.couponId,
                value: couponCurrency.value,
                createdAt: couponCurrency.createdAt,
                updatedAt: couponCurrency.updatedAt,
                currency: couponCurrency.currency,
                coupon: couponCurrency.coupon,
            };
        } catch (error) {
            throw new Error(`Failed to map coupon currency to response DTO: ${error.message}`);
        }
    }

    async currency(couponId: number): Promise<{ couponId: number; currencyId: number; value: number }[]> {
        try {
           
            const couponCurrencies = await this.couponCurrencyRepository.find({
                where: { couponId },
                select: ['couponId', 'currencyId', 'value']
            });

            return couponCurrencies;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error(`Failed to fetch currency data for couponId ${couponId}: ${error.message}`);
        }
    }
} 