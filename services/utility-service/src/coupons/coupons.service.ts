import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Coupon } from './coupons.entity';
import { CouponResponseDto } from './dto/coupon-response.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
    constructor(
        @InjectRepository(Coupon)
        private readonly couponRepository: Repository<Coupon>,
    ) { }

    private validateCreateCouponDto(createCouponDto: CreateCouponDto): void {
        if (!createCouponDto.code || createCouponDto.code.trim() === '') {
            throw new BadRequestException('Coupon code is required');
        }

        if (!createCouponDto.label || createCouponDto.label.trim() === '') {
            throw new BadRequestException('Coupon label is required');
        }

        if (createCouponDto.code.length < 3 || createCouponDto.code.length > 50) {
            throw new BadRequestException('Coupon code must be between 3 and 50 characters');
        }

        if (createCouponDto.label.length < 3 || createCouponDto.label.length > 100) {
            throw new BadRequestException('Coupon label must be between 3 and 100 characters');
        }

        if (createCouponDto.maximumNumber !== undefined && createCouponDto.maximumNumber < 1) {
            throw new BadRequestException('Maximum number must be at least 1');
        }

        if (createCouponDto.status !== undefined && ![0, 1].includes(createCouponDto.status)) {
            throw new BadRequestException('Status must be 0 (inactive) or 1 (active)');
        }

        if (createCouponDto.couponType !== undefined && ![1, 2].includes(createCouponDto.couponType)) {
            throw new BadRequestException('Coupon type must be 1 (public) or 2 (corporate)');
        }

        if (createCouponDto.discountType !== undefined && !['Percent', 'Flat'].includes(createCouponDto.discountType)) {
            throw new BadRequestException('Discount type must be "Percent" or "Flat"');
        }
    }

    private validateUpdateCouponDto(updateCouponDto: UpdateCouponDto): void {
        if (updateCouponDto.code !== undefined) {
            if (updateCouponDto.code.trim() === '') {
                throw new BadRequestException('Coupon code cannot be empty');
            }
            if (updateCouponDto.code.length < 3 || updateCouponDto.code.length > 50) {
                throw new BadRequestException('Coupon code must be between 3 and 50 characters');
            }
        }

        if (updateCouponDto.label !== undefined) {
            if (updateCouponDto.label.trim() === '') {
                throw new BadRequestException('Coupon label cannot be empty');
            }
            if (updateCouponDto.label.length < 3 || updateCouponDto.label.length > 100) {
                throw new BadRequestException('Coupon label must be between 3 and 100 characters');
            }
        }

        if (updateCouponDto.maximumNumber !== undefined && updateCouponDto.maximumNumber < 1) {
            throw new BadRequestException('Maximum number must be at least 1');
        }

        if (updateCouponDto.status !== undefined && ![0, 1].includes(updateCouponDto.status)) {
            throw new BadRequestException('Status must be 0 (inactive) or 1 (active)');
        }

        if (updateCouponDto.couponType !== undefined && ![1, 2].includes(updateCouponDto.couponType)) {
            throw new BadRequestException('Coupon type must be 1 (public) or 2 (corporate)');
        }

        if (updateCouponDto.discountType !== undefined && !['Percent', 'Flat'].includes(updateCouponDto.discountType)) {
            throw new BadRequestException('Discount type must be "Percent" or "Flat"');
        }
    }

    async create(createCouponDto: CreateCouponDto): Promise<CouponResponseDto> {
        try {
            // Validate input
            this.validateCreateCouponDto(createCouponDto);

            // Check if coupon code already exists
            const existingCoupon = await this.couponRepository.findOne({
                where: { code: createCouponDto.code.trim() }
            });

            if (existingCoupon) {
                throw new ConflictException('Coupon code already exists');
            }

            // Validate expiry date if provided
            if (createCouponDto.expiryDate) {
                const expiryDate = new Date(createCouponDto.expiryDate);
                const today = new Date();

                if (isNaN(expiryDate.getTime())) {
                    throw new BadRequestException('Invalid expiry date format');
                }

                if (expiryDate <= today) {
                    throw new BadRequestException('Expiry date must be in the future');
                }
            }

            const coupon = this.couponRepository.create({
                ...createCouponDto,
                code: createCouponDto.code.trim(),
                label: createCouponDto.label.trim(),
                expiryDate: createCouponDto.expiryDate ? new Date(createCouponDto.expiryDate) : null,
            });

            const savedCoupon = await this.couponRepository.save(coupon);
            return this.mapToResponseDto(savedCoupon);
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create coupon');
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: number,
        couponType?: number,
    ): Promise<{ data: CouponResponseDto[]; total: number; page: number; limit: number }> {
        try {
            // Validate pagination parameters
            if (page < 1) {
                throw new BadRequestException('Page must be at least 1');
            }
            if (limit < 1 || limit > 100) {
                throw new BadRequestException('Limit must be between 1 and 100');
            }

            // Validate status if provided
            if (status !== undefined && ![0, 1].includes(status)) {
                throw new BadRequestException('Status must be 0 (inactive) or 1 (active)');
            }

            // Validate coupon type if provided
            if (couponType !== undefined && ![1, 2].includes(couponType)) {
                throw new BadRequestException('Coupon type must be 1 (public) or 2 (corporate)');
            }

            const skip = (page - 1) * limit;
            const whereConditions: FindOptionsWhere<Coupon> = {};

            if (search && search.trim() !== '') {
                whereConditions.label = Like(`%${search.trim()}%`);
            }

            if (status !== undefined) {
                whereConditions.status = status;
            }

            if (couponType !== undefined) {
                whereConditions.couponType = couponType;
            }

            const [coupons, total] = await this.couponRepository.findAndCount({
                where: whereConditions,
                skip,
                take: limit,
                order: { createdAt: 'DESC' },
            });

            return {
                data: coupons.map(coupon => this.mapToResponseDto(coupon)),
                total,
                page,
                limit,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch coupons');
        }
    }

    async findOne(id: number): Promise<CouponResponseDto> {
        try {
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid coupon ID');
            }

            const coupon = await this.couponRepository.findOne({
                where: { id }
            });

            if (!coupon) {
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }

            return this.mapToResponseDto(coupon);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch coupon');
        }
    }

    async findByCode(code: string): Promise<CouponResponseDto> {
        try {
            if (!code || code.trim() === '') {
                throw new BadRequestException('Coupon code is required');
            }

            const coupon = await this.couponRepository.findOne({
                where: { code: code.trim() }
            });

            if (!coupon) {
                throw new NotFoundException(`Coupon with code ${code} not found`);
            }

            return this.mapToResponseDto(coupon);
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch coupon by code');
        }
    }

    async update(id: number, updateCouponDto: UpdateCouponDto): Promise<CouponResponseDto> {
        try {
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid coupon ID');
            }

            // Validate input
            this.validateUpdateCouponDto(updateCouponDto);

            const coupon = await this.couponRepository.findOne({
                where: { id }
            });

            if (!coupon) {
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }

            // Check if code is being updated and if it already exists
            if (updateCouponDto.code && updateCouponDto.code.trim() !== coupon.code) {
                const existingCoupon = await this.couponRepository.findOne({
                    where: { code: updateCouponDto.code.trim() }
                });

                if (existingCoupon) {
                    throw new ConflictException('Coupon code already exists');
                }
            }

            // Validate expiry date if provided
            if (updateCouponDto.expiryDate) {
                const expiryDate = new Date(updateCouponDto.expiryDate);
                const today = new Date();

                if (isNaN(expiryDate.getTime())) {
                    throw new BadRequestException('Invalid expiry date format');
                }

                if (expiryDate <= today) {
                    throw new BadRequestException('Expiry date must be in the future');
                }
            }

            // Update the coupon
            Object.assign(coupon, {
                ...updateCouponDto,
                code: updateCouponDto.code ? updateCouponDto.code.trim() : coupon.code,
                label: updateCouponDto.label ? updateCouponDto.label.trim() : coupon.label,
                expiryDate: updateCouponDto.expiryDate ? new Date(updateCouponDto.expiryDate) : coupon.expiryDate,
            });

            const updatedCoupon = await this.couponRepository.save(coupon);
            return this.mapToResponseDto(updatedCoupon);
        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof ConflictException ||
                error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update coupon');
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        try {
            if (!id || id <= 0) {
                throw new BadRequestException('Invalid coupon ID');
            }

            const coupon = await this.couponRepository.findOne({
                where: { id }
            });

            if (!coupon) {
                throw new NotFoundException(`Coupon with ID ${id} not found`);
            }

            await this.couponRepository.remove(coupon);
            return { message: 'Coupon deleted successfully' };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete coupon');
        }
    }

    async validateCoupon(code: string, userDomain?: string): Promise<{ valid: boolean; message: string; coupon?: CouponResponseDto }> {
        try {
            if (!code || code.trim() === '') {
                return { valid: false, message: 'Coupon code is required' };
            }

            const coupon = await this.couponRepository.findOne({
                where: { code: code.trim() }
            });

            if (!coupon) {
                return { valid: false, message: 'Invalid coupon code' };
            }

            // Check if coupon is active
            if (coupon.status === 0) {
                return { valid: false, message: 'Coupon is inactive' };
            }

            // Check if coupon has expired
            if (coupon.expiryDate && new Date() > coupon.expiryDate) {
                return { valid: false, message: 'Coupon has expired' };
            }

            // Check coupon type restrictions
            if (coupon.couponType === 2 && !userDomain) { // Corporate coupon
                return { valid: false, message: 'Corporate coupon requires company domain' };
            }

            if (coupon.couponType === 2 && userDomain && coupon.companyDomain) {
                if (!userDomain.includes(coupon.companyDomain) && !coupon.companyDomain.includes(userDomain)) {
                    return { valid: false, message: 'Coupon is not valid for this company domain' };
                }
            }

            return {
                valid: true,
                message: 'Coupon is valid',
                coupon: this.mapToResponseDto(coupon)
            };
        } catch (error) {
            return { valid: false, message: 'Error validating coupon' };
        }
    }

    async getActiveCoupons(): Promise<CouponResponseDto[]> {
        try {
            const coupons = await this.couponRepository.find({
                where: { status: 1 },
                order: { createdAt: 'DESC' },
            });

            return coupons.map(coupon => this.mapToResponseDto(coupon));
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch active coupons');
        }
    }

    async getExpiredCoupons(): Promise<CouponResponseDto[]> {
        try {
            const today = new Date();
            const coupons = await this.couponRepository
                .createQueryBuilder('coupon')
                .where('coupon.expiryDate < :today', { today })
                .andWhere('coupon.expiryDate IS NOT NULL')
                .orderBy('coupon.expiryDate', 'DESC')
                .getMany();

            return coupons.map(coupon => this.mapToResponseDto(coupon));
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch expired coupons');
        }
    }

    async getCouponsByType(couponType: number): Promise<CouponResponseDto[]> {
        try {
            if (![1, 2].includes(couponType)) {
                throw new BadRequestException('Coupon type must be 1 (public) or 2 (corporate)');
            }

            const coupons = await this.couponRepository.find({
                where: { couponType },
                order: { createdAt: 'DESC' },
            });

            return coupons.map(coupon => this.mapToResponseDto(coupon));
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch coupons by type');
        }
    }

    private mapToResponseDto(coupon: Coupon): CouponResponseDto {
        return {
            id: coupon.id,
            label: coupon.label,
            code: coupon.code,
            status: coupon.status,
            couponType: coupon.couponType,
            discountType: coupon.discountType,
            maximumNumber: coupon.maximumNumber,
            expiryDate: coupon.expiryDate,
            companyDomain: coupon.companyDomain,
            createdBy: coupon.createdBy,
            createdAt: coupon.createdAt,
            updatedAt: coupon.updatedAt,
        };
    }
} 