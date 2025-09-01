import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTimezoneMasterDto } from './dto/create-timezone-master.dto';
import { TimezoneMasterResponseDto } from './dto/timezone-master-response.dto';
import { UpdateTimezoneMasterDto } from './dto/update-timezone-master.dto';
import { TimezoneMaster } from './timezone-master.entity';

@Injectable()
export class TimezoneService {
  private readonly logger = new Logger(TimezoneService.name);

  constructor(
    @InjectRepository(TimezoneMaster)
    private readonly timezoneMasterRepository: Repository<TimezoneMaster>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async findAll(): Promise<TimezoneMasterResponseDto[]> {
    try {
      this.logger.log('Fetching all timezones');
      const timezones = await this.timezoneMasterRepository.find({
        order: { timezoneValue: 'ASC' },
      });

      if (!timezones || timezones.length === 0) {
        this.logger.warn('No timezones found in the system');
        return [];
      }

      this.logger.log(`Found ${timezones.length} timezones`);
      return timezones.map(timezone => this.mapToResponseDto(timezone));
    } catch (error) {
      this.logger.error(`Failed to fetch timezones: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching timezones: ${error.message}`);
    }
  }

  async findAllWithFilters(filters: any): Promise<TimezoneMasterResponseDto[]> {
    try {
      this.logger.log('Fetching timezones with filters:', filters);

      // Validate filters
      if (!filters || typeof filters !== 'object') {
        throw new BadRequestException('Invalid filters provided');
      }

      const queryBuilder = this.timezoneMasterRepository.createQueryBuilder('timezone');

      // Filter by abbreviation
      if (filters.abbr) {
        if (typeof filters.abbr !== 'string' || filters.abbr.trim().length === 0) {
          throw new BadRequestException('Invalid abbreviation provided');
        }
        queryBuilder.andWhere('timezone.timezoneAbbr = :abbr', { abbr: filters.abbr.trim().toUpperCase() });
      }

      // Search by timezone name or value
      if (filters.search) {
        if (typeof filters.search !== 'string' || filters.search.trim().length === 0) {
          throw new BadRequestException('Invalid search term provided');
        }
        queryBuilder.andWhere(
          '(timezone.timezoneValue LIKE :search OR timezone.timezoneText LIKE :search)',
          { search: `%${filters.search.trim()}%` }
        );
      }

      // Order by timezone value
      queryBuilder.orderBy('timezone.timezoneValue', 'ASC');

      const timezones = await queryBuilder.getMany();

      // Check if any results found when specific filters are applied
      if (timezones.length === 0) {
        const appliedFilters = Object.keys(filters).filter(key =>
          filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
        );

        if (appliedFilters.length > 0) {
          this.logger.warn(`No timezones found with the provided filters: ${JSON.stringify(filters)}`);
          throw new NotFoundException(`No timezones found matching the provided criteria: ${appliedFilters.join(', ')}`);
        }
      }

      this.logger.log(`Found ${timezones.length} timezones with filters`);
      return timezones.map(timezone => this.mapToResponseDto(timezone));
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch timezones with filters: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching timezones with filters: ${error.message}`);
    }
  }

  async findById(id: number): Promise<TimezoneMasterResponseDto> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid timezone ID provided. Must be a positive number');
      }

      this.logger.log(`Fetching timezone with ID: ${id}`);
      const timezone = await this.timezoneMasterRepository.findOne({
        where: { id },
      });

      if (!timezone) {
        throw new NotFoundException(`Timezone with ID ${id} not found`);
      }

      this.logger.log(`Found timezone: ${timezone.timezoneValue}`);
      return this.mapToResponseDto(timezone);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch timezone with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the timezone: ${error.message}`);
    }
  }

  async findByAbbr(abbr: string): Promise<TimezoneMasterResponseDto> {
    try {
      // Validate input
      if (!abbr || typeof abbr !== 'string' || abbr.trim().length === 0) {
        throw new BadRequestException('Invalid abbreviation provided. Must be a non-empty string');
      }

      const normalizedAbbr = abbr.trim().toUpperCase();
      this.logger.log(`Fetching timezone with abbreviation: ${normalizedAbbr}`);

      const timezone = await this.timezoneMasterRepository.findOne({
        where: { timezoneAbbr: normalizedAbbr },
      });

      if (!timezone) {
        throw new NotFoundException(`Timezone with abbreviation '${normalizedAbbr}' not found`);
      }

      this.logger.log(`Found timezone: ${timezone.timezoneValue}`);
      return this.mapToResponseDto(timezone);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch timezone with abbreviation ${abbr}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the timezone: ${error.message}`);
    }
  }

  async getDefaultTimezone(): Promise<TimezoneMasterResponseDto> {
    try {
      this.logger.log('Fetching default timezone');
      // Assuming default timezone has ID 1 (Asia/Kolkata)
      const timezone = await this.timezoneMasterRepository.findOne({
        where: { id: 1 },
      });

      if (!timezone) {
        throw new NotFoundException('Default timezone (ID: 1) not found. Please check system configuration');
      }

      this.logger.log(`Found default timezone: ${timezone.timezoneValue}`);
      return this.mapToResponseDto(timezone);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch default timezone: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the default timezone: ${error.message}`);
    }
  }

  async create(createTimezoneMasterDto: CreateTimezoneMasterDto): Promise<TimezoneMasterResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate input
      if (!createTimezoneMasterDto || typeof createTimezoneMasterDto !== 'object') {
        throw new BadRequestException('Invalid timezone data provided');
      }

      // Validate required fields
      if (!createTimezoneMasterDto.timezoneValue || typeof createTimezoneMasterDto.timezoneValue !== 'string' || createTimezoneMasterDto.timezoneValue.trim().length === 0) {
        throw new BadRequestException('Timezone value is required and must be a non-empty string');
      }

      if (!createTimezoneMasterDto.timezoneAbbr || typeof createTimezoneMasterDto.timezoneAbbr !== 'string' || createTimezoneMasterDto.timezoneAbbr.trim().length === 0) {
        throw new BadRequestException('Timezone abbreviation is required and must be a non-empty string');
      }

      // Check if timezone with same value or abbreviation already exists
      const existingTimezone = await queryRunner.manager.findOne(TimezoneMaster, {
        where: [
          { timezoneValue: createTimezoneMasterDto.timezoneValue.trim() },
          { timezoneAbbr: createTimezoneMasterDto.timezoneAbbr.trim().toUpperCase() }
        ]
      });

      if (existingTimezone) {
        throw new ConflictException(`Timezone with value '${createTimezoneMasterDto.timezoneValue.trim()}' or abbreviation '${createTimezoneMasterDto.timezoneAbbr.trim().toUpperCase()}' already exists`);
      }

      // Normalize data
      const normalizedData = {
        ...createTimezoneMasterDto,
        timezoneValue: createTimezoneMasterDto.timezoneValue.trim(),
        timezoneAbbr: createTimezoneMasterDto.timezoneAbbr.trim().toUpperCase(),
        timezoneText: createTimezoneMasterDto.timezoneText?.trim() || null
      };

      this.logger.log('Creating new timezone');
      const timezone = queryRunner.manager.create(TimezoneMaster, normalizedData);
      const savedTimezone = await queryRunner.manager.save(TimezoneMaster, timezone);

      await queryRunner.commitTransaction();
      this.logger.log(`Created timezone: ${savedTimezone.timezoneValue}`);
      return this.mapToResponseDto(savedTimezone);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create timezone: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while creating the timezone: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateTimezoneMasterDto: UpdateTimezoneMasterDto): Promise<TimezoneMasterResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid timezone ID provided. Must be a positive number');
      }

      if (!updateTimezoneMasterDto || typeof updateTimezoneMasterDto !== 'object') {
        throw new BadRequestException('Invalid update data provided');
      }

      this.logger.log(`Updating timezone with ID: ${id}`);

      // Check if timezone exists
      const existingTimezone = await queryRunner.manager.findOne(TimezoneMaster, {
        where: { id }
      });

      if (!existingTimezone) {
        throw new NotFoundException(`Timezone with ID ${id} not found`);
      }

      // Validate update fields if provided
      if (updateTimezoneMasterDto.timezoneValue !== undefined) {
        if (typeof updateTimezoneMasterDto.timezoneValue !== 'string' || updateTimezoneMasterDto.timezoneValue.trim().length === 0) {
          throw new BadRequestException('Timezone value must be a non-empty string');
        }
        const normalizedValue = updateTimezoneMasterDto.timezoneValue.trim();

        // Check if timezone value already exists
        const existingTimezoneWithValue = await queryRunner.manager
          .createQueryBuilder(TimezoneMaster, 'timezone')
          .where('timezone.timezoneValue = :value', { value: normalizedValue })
          .andWhere('timezone.id != :id', { id })
          .getOne();

        if (existingTimezoneWithValue) {
          throw new ConflictException(`Timezone with value '${normalizedValue}' already exists`);
        }
        updateTimezoneMasterDto.timezoneValue = normalizedValue;
      }

      if (updateTimezoneMasterDto.timezoneAbbr !== undefined) {
        if (typeof updateTimezoneMasterDto.timezoneAbbr !== 'string' || updateTimezoneMasterDto.timezoneAbbr.trim().length === 0) {
          throw new BadRequestException('Timezone abbreviation must be a non-empty string');
        }
        const normalizedAbbr = updateTimezoneMasterDto.timezoneAbbr.trim().toUpperCase();

        // Check if timezone abbreviation already exists
        const existingTimezoneWithAbbr = await queryRunner.manager
          .createQueryBuilder(TimezoneMaster, 'timezone')
          .where('timezone.timezoneAbbr = :abbr', { abbr: normalizedAbbr })
          .andWhere('timezone.id != :id', { id })
          .getOne();

        if (existingTimezoneWithAbbr) {
          throw new ConflictException(`Timezone with abbreviation '${normalizedAbbr}' already exists`);
        }
        updateTimezoneMasterDto.timezoneAbbr = normalizedAbbr;
      }

      if (updateTimezoneMasterDto.timezoneText !== undefined) {
        updateTimezoneMasterDto.timezoneText = updateTimezoneMasterDto.timezoneText?.trim() || null;
      }

      Object.assign(existingTimezone, updateTimezoneMasterDto);
      const updatedTimezone = await queryRunner.manager.save(TimezoneMaster, existingTimezone);

      await queryRunner.commitTransaction();
      this.logger.log(`Updated timezone: ${updatedTimezone.timezoneValue}`);
      return this.mapToResponseDto(updatedTimezone);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error updating timezone with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update timezone in database');
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid timezone ID provided. Must be a positive number');
      }

      this.logger.log(`Deleting timezone with ID: ${id}`);

      // Check if timezone exists
      const timezone = await queryRunner.manager.findOne(TimezoneMaster, {
        where: { id }
      });

      if (!timezone) {
        throw new NotFoundException(`Timezone with ID ${id} not found`);
      }

      await queryRunner.manager.remove(TimezoneMaster, timezone);

      await queryRunner.commitTransaction();
      this.logger.log(`Deleted timezone: ${timezone.timezoneValue}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting timezone with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete timezone from database');
    } finally {
      await queryRunner.release();
    }
  }

  private mapToResponseDto(timezone: TimezoneMaster): TimezoneMasterResponseDto {
    return {
      id: timezone.id,
      timezoneValue: timezone.timezoneValue,
      timezoneAbbr: timezone.timezoneAbbr,
      timezoneOffset: timezone.timezoneOffset,
      isdst: timezone.isdst,
      timezoneText: timezone.timezoneText
    };
  }

  async getTimezoneWithMeta(timezoneId: number) {
    try {
      if (!timezoneId || typeof timezoneId !== 'number' || timezoneId <= 0) {
        throw new BadRequestException('Invalid timezone ID provided. Must be a positive number');
      }
      return await this.timezoneMasterRepository.findOne({ where: { id: timezoneId }, relations: ['timezoneMeta'] });
    } catch (error) {
      this.logger.error(`Error fetching timezone with meta for ID ${timezoneId}: ${error.message}`);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch timezone details');
    }
  }


} 