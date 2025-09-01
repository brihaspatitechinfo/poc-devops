import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { TimezoneMaster } from '../timezone/timezone-master.entity';
import { CreateTimezoneMetaDto } from './dto/create-timezone-meta.dto';
import { TimezoneMetaResponseDto } from './dto/timezone-meta-response.dto';
import { UpdateTimezoneMetaDto } from './dto/update-timezone-meta.dto';
import { TimezoneMeta } from './entities/timezone-meta.entity';

@Injectable()
export class TimezoneMetaService {
    private readonly logger = new Logger(TimezoneMetaService.name);

    constructor(
        @InjectRepository(TimezoneMeta)
        private timezoneMetaRepository: Repository<TimezoneMeta>,
        @InjectRepository(TimezoneMaster)
        private timezoneMasterRepository: Repository<TimezoneMaster>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async create(createTimezoneMetaDto: CreateTimezoneMetaDto): Promise<{ statusCode: number; message: string; data?: TimezoneMetaResponseDto }> {
        try {
            const timezoneMeta = this.timezoneMetaRepository.create(createTimezoneMetaDto);
            const savedTimezoneMeta = await this.timezoneMetaRepository.save(timezoneMeta);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Timezone meta created successfully',
                data: savedTimezoneMeta
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Timezone meta already exists');
            }
            this.logger.error(`Failed to create timezone meta: ${error.message}`);
            throw new InternalServerErrorException('Failed to create timezone meta');
        }
    }

    async findAll(): Promise<{ statusCode: number; message: string; data: TimezoneMetaResponseDto[] }> {
        try {
            const timezoneMetas = await this.timezoneMetaRepository.find({
                order: { id: 'ASC' }
            });

            return {
                statusCode: HttpStatus.OK,
                message: 'Timezone metas retrieved successfully',
                data: timezoneMetas
            };
        } catch (error) {
            this.logger.error(`Failed to retrieve timezone metas: ${error.message}`);
            throw new InternalServerErrorException('Failed to retrieve timezone metas');
        }
    }

    async findOne(id: number): Promise<{ statusCode: number; message: string; data: TimezoneMetaResponseDto }> {
        try {
            const timezoneMeta = await this.timezoneMetaRepository.findOne({
                where: { id }
            });

            if (!timezoneMeta) {
                throw new NotFoundException(`Timezone meta with ID ${id} not found`);
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'Timezone meta retrieved successfully',
                data: timezoneMeta
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to retrieve timezone meta: ${error.message}`);
            throw new InternalServerErrorException('Failed to retrieve timezone meta');
        }
    }

    async findByTimezoneId(timezoneId: number): Promise<{ statusCode: number; message: string; data: TimezoneMetaResponseDto[] }> {
        try {
            const timezoneMetas = await this.timezoneMetaRepository.find({
                where: { timezoneId },
                order: { id: 'ASC' }
            });

            return {
                statusCode: HttpStatus.OK,
                message: 'Timezone metas retrieved successfully',
                data: timezoneMetas
            };
        } catch (error) {
            this.logger.error(`Failed to retrieve timezone metas for timezone ID ${timezoneId}: ${error.message}`);
            throw new InternalServerErrorException('Failed to retrieve timezone metas');
        }
    }

    async update(id: number, updateTimezoneMetaDto: UpdateTimezoneMetaDto): Promise<{ statusCode: number; message: string; data?: TimezoneMetaResponseDto }> {
        try {
            const timezoneMeta = await this.timezoneMetaRepository.findOne({ where: { id } });
            if (!timezoneMeta) {
                throw new NotFoundException(`Timezone meta with ID ${id} not found`);
            }
            await this.timezoneMetaRepository.update(id, updateTimezoneMetaDto);
            const updatedTimezoneMeta = await this.timezoneMetaRepository.findOne({
                where: { id }
            });
            return {
                statusCode: HttpStatus.OK,
                message: 'Timezone meta updated successfully',
                data: updatedTimezoneMeta
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Timezone meta already exists with these details');
            }
            this.logger.error(`Failed to update timezone meta: ${error.message}`);
            throw new InternalServerErrorException('Failed to update timezone meta');
        }
    }

    async remove(id: number): Promise<{ statusCode: number; message: string }> {
        try {
            const timezoneMeta = await this.timezoneMetaRepository.findOne({ where: { id } });
            if (!timezoneMeta) {
                throw new NotFoundException(`Timezone meta with ID ${id} not found`);
            }
            await this.timezoneMetaRepository.delete(id);
            return {
                statusCode: HttpStatus.OK,
                message: 'Timezone meta deleted successfully'
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to delete timezone meta: ${error.message}`);
            throw new InternalServerErrorException('Failed to delete timezone meta');
        }
    }

    async getTimezoneMeta(timezoneId: number): Promise<TimezoneMetaResponseDto> {
        try {
            const cacheKey = 'timezoneMetaList';
            let timezoneMetaList: any[] = await this.cacheManager.get(cacheKey);
            if (!timezoneMetaList) {
                timezoneMetaList = await this.timezoneMetaRepository.createQueryBuilder('tm').select(['tm.timezoneId', 'tm.timezoneMeta']).groupBy('tm.timezoneId').getRawMany();
                await this.cacheManager.set(cacheKey, timezoneMetaList, 0); // ttl: 0 means forever
            }
            const timezoneMeta = timezoneMetaList.find(meta => meta.timezoneId === timezoneId);
            if (!timezoneMeta) {
                throw new NotFoundException(`Timezone meta not found for timezone ID ${timezoneId}`);
            }
            return {
                id: timezoneId,
                timezoneId: timezoneMeta.timezoneId,
                timezoneMeta: timezoneMeta.timezoneMeta
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to get timezone meta: ${error.message}`);
            throw new InternalServerErrorException('Failed to get timezone meta');
        }
    }

    async getTimeZoneMetaNameById(timezoneId: number): Promise<string> {
        try {
            if (!timezoneId) {
                return 'Asia/Kolkata';
            }
            const timezoneMeta = await this.timezoneMetaRepository.findOne({ where: { timezoneId }, relations: ['timezone'] });
            if (!timezoneMeta || !timezoneMeta.timezone) {
                const timezoneMaster = await this.timezoneMasterRepository.findOne({ where: { id: timezoneId } });
                return timezoneMaster?.timezoneValue || 'Asia/Kolkata';
            }
            return timezoneMeta.timezone.timezoneValue || 'Asia/Kolkata';
        } catch (error) {
            this.logger.error(`Failed to get timezone meta name: ${error.message}`);
            return 'Asia/Kolkata'; // Default to India timezone on error
        }
    }

} 