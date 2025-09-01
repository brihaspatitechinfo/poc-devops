import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Currency } from './currency.entity';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async findAll(): Promise<Currency[]> {
    try {
      this.logger.log('Fetching all currencies');
      const currencies = await this.currencyRepository.find({
        where: { status: 1 },
        order: { sortOrder: 'ASC', currency: 'ASC' },
      });
      if (!currencies || currencies.length === 0) {
        this.logger.warn('No active currencies found in the system');
        return [];
      }
      this.logger.log(`Found ${currencies.length} currencies`);
      return currencies;
    } catch (error) {
      this.logger.error(`Failed to fetch currencies: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching currencies: ${error.message}`);
    }
  }

  async findAllWithFilters(filters: any): Promise<Currency[]> {
    try {
      this.logger.log('Fetching currencies with filters:', filters);

      // Validate filters
      if (!filters || typeof filters !== 'object') {
        throw new BadRequestException('Invalid filters provided');
      }

      const queryBuilder = this.currencyRepository.createQueryBuilder('currency');

      // Base condition - only active currencies
      queryBuilder.where('currency.status = :status', { status: 1 });

      // Filter by active status
      if (filters.active !== undefined) {
        if (typeof filters.active !== 'boolean' && filters.active !== 'true' && filters.active !== 'false') {
          throw new BadRequestException('Invalid active filter value. Must be boolean or string "true"/"false"');
        }
        const isActive = filters.active === 'true' || filters.active === true;
        queryBuilder.andWhere('currency.status = :activeStatus', { activeStatus: isActive ? 1 : 0 });
      }

      // Filter by currency code
      if (filters.code) {
        if (typeof filters.code !== 'string' || filters.code.trim().length === 0) {
          throw new BadRequestException('Invalid currency code provided');
        }
        queryBuilder.andWhere('currency.code = :code', { code: filters.code.trim().toUpperCase() });
      }

      // Filter by currency symbol
      if (filters.symbol) {
        if (typeof filters.symbol !== 'string' || filters.symbol.trim().length === 0) {
          throw new BadRequestException('Invalid currency symbol provided');
        }
        queryBuilder.andWhere('currency.symbol = :symbol', { symbol: filters.symbol.trim() });
      }

      // Search by currency name
      if (filters.search) {
        if (typeof filters.search !== 'string' || filters.search.trim().length === 0) {
          throw new BadRequestException('Invalid search term provided');
        }
        queryBuilder.andWhere('currency.currency LIKE :search', { search: `%${filters.search.trim()}%` });
      }

      // Order by sort order and name
      queryBuilder.orderBy('currency.sortOrder', 'ASC');
      queryBuilder.addOrderBy('currency.currency', 'ASC');

      const currencies = await queryBuilder.getMany();

      // Check if any results found when specific filters are applied
      if (currencies.length === 0) {
        const appliedFilters = Object.keys(filters).filter(key =>
          filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
        );

        if (appliedFilters.length > 0) {
          this.logger.warn(`No currencies found with the provided filters: ${JSON.stringify(filters)}`);
          throw new NotFoundException(`No currencies found matching the provided criteria: ${appliedFilters.join(', ')}`);
        }
      }

      this.logger.log(`Found ${currencies.length} currencies with filters`);
      return currencies;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch currencies with filters: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching currencies with filters: ${error.message}`);
    }
  }

  async findById(id: number): Promise<Currency> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid currency ID provided. Must be a positive number');
      }
      const currency = await this.currencyRepository.findOne({ where: { id } });
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found or is inactive`);
      }
      return currency;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch currency with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the currency: ${error.message}`);
    }
  }

  async findByCode(code: string): Promise<Currency> {
    try {
      // Validate input
      if (!code || typeof code !== 'string' || code.trim().length === 0) {
        throw new BadRequestException('Invalid currency code provided. Must be a non-empty string');
      }

      const normalizedCode = code.trim().toUpperCase();
      this.logger.log(`Fetching currency with code: ${normalizedCode}`);

      const currency = await this.currencyRepository.findOne({
        where: { code: normalizedCode, status: 1 },
      });

      if (!currency) {
        throw new NotFoundException(`Currency with code '${normalizedCode}' not found or is inactive`);
      }

      this.logger.log(`Found currency: ${currency.currency}`);
      return currency;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch currency with code ${code}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the currency: ${error.message}`);
    }
  }

  async findByIdWithoutRelations(id: number): Promise<Currency> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid currency ID provided. Must be a positive number');
      }

      this.logger.log(`Fetching currency with ID: ${id} (without relations)`);
      const currency = await this.currencyRepository.findOne({
        where: { id, status: 1 },
      });

      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found or is inactive`);
      }

      this.logger.log(`Found currency: ${currency.currency}`);
      return currency;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch currency with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the currency: ${error.message}`);
    }
  }

  async getActiveCurrencies(): Promise<Currency[]> {
    try {
      this.logger.log('Fetching active currencies');
      const currencies = await this.currencyRepository.find({
        where: { status: 1 },
        select: ['id', 'currency', 'code', 'symbol', 'sortOrder'],
        order: { sortOrder: 'ASC' },
      });

      if (!currencies || currencies.length === 0) {
        this.logger.warn('No active currencies found in the system');
        return [];
      }

      this.logger.log(`Found ${currencies.length} active currencies`);
      return currencies;
    } catch (error) {
      this.logger.error(`Failed to fetch active currencies: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching active currencies: ${error.message}`);
    }
  }

  async getDefaultCurrency(): Promise<Currency> {
    try {
      this.logger.log('Fetching default currency');
      // Assuming default currency has ID 1 (INR)
      const currency = await this.currencyRepository.findOne({
        where: { id: 1, status: 1 },
      });

      if (!currency) {
        throw new NotFoundException('Default currency (ID: 1) not found or is inactive. Please check system configuration');
      }

      this.logger.log(`Found default currency: ${currency.currency}`);
      return currency;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch default currency: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the default currency: ${error.message}`);
    }
  }

  async getCurrencySymbols(): Promise<Array<{ id: number; symbol: string }>> {
    try {
      this.logger.log('Fetching currency symbols');
      const currencies = await this.currencyRepository.find({
        where: { status: 1 },
        select: ['id', 'symbol'],
        order: { sortOrder: 'ASC' },
      });

      if (!currencies || currencies.length === 0) {
        this.logger.warn('No currency symbols found in the system');
        return [];
      }

      this.logger.log(`Found ${currencies.length} currency symbols`);
      return currencies;
    } catch (error) {
      this.logger.error(`Failed to fetch currency symbols: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching currency symbols: ${error.message}`);
    }
  }

  async checkIfCurrencyIsActive(currencyId: number): Promise<boolean> {
    try {
      // Validate input
      if (!currencyId || typeof currencyId !== 'number' || currencyId <= 0) {
        throw new BadRequestException('Invalid currency ID provided. Must be a positive number');
      }

      this.logger.log(`Checking if currency with ID ${currencyId} is active`);
      const currency = await this.currencyRepository.findOne({
        where: { id: currencyId, status: 1 },
        select: ['id'],
      });

      const isActive = !!currency;
      this.logger.log(`Currency with ID ${currencyId} is ${isActive ? 'active' : 'inactive'}`);
      return isActive;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to check currency status for ID ${currencyId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while checking currency status: ${error.message}`);
    }
  }

  async create(createCurrencyDto: Partial<Currency>): Promise<Currency> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate input
      if (!createCurrencyDto || typeof createCurrencyDto !== 'object') {
        throw new BadRequestException('Invalid currency data provided');
      }

      // Validate required fields
      if (!createCurrencyDto.currency || typeof createCurrencyDto.currency !== 'string' || createCurrencyDto.currency.trim().length === 0) {
        throw new BadRequestException('Currency name is required and must be a non-empty string');
      }

      if (!createCurrencyDto.code || typeof createCurrencyDto.code !== 'string' || createCurrencyDto.code.trim().length === 0) {
        throw new BadRequestException('Currency code is required and must be a non-empty string');
      }

      if (!createCurrencyDto.symbol || typeof createCurrencyDto.symbol !== 'string' || createCurrencyDto.symbol.trim().length === 0) {
        throw new BadRequestException('Currency symbol is required and must be a non-empty string');
      }

      // Check if currency code already exists
      const existingCurrency = await queryRunner.manager.findOne(Currency, {
        where: { code: createCurrencyDto.code.trim().toUpperCase() }
      });

      if (existingCurrency) {
        throw new ConflictException(`Currency with code '${createCurrencyDto.code.trim().toUpperCase()}' already exists`);
      }

      // Normalize data
      const normalizedData = {
        ...createCurrencyDto,
        currency: createCurrencyDto.currency.trim(),
        code: createCurrencyDto.code.trim().toUpperCase(),
        symbol: createCurrencyDto.symbol.trim(),
        status: createCurrencyDto.status ?? 1,
        sortOrder: createCurrencyDto.sortOrder ?? 0
      };

      this.logger.log('Creating new currency');
      const currency = queryRunner.manager.create(Currency, normalizedData);
      const savedCurrency = await queryRunner.manager.save(Currency, currency);

      await queryRunner.commitTransaction();
      this.logger.log(`Created currency: ${savedCurrency.currency}`);
      return savedCurrency;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create currency: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while creating the currency: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateCurrencyDto: Partial<Currency>): Promise<Currency> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid currency ID provided. Must be a positive number');
      }

      if (!updateCurrencyDto || typeof updateCurrencyDto !== 'object') {
        throw new BadRequestException('Invalid update data provided');
      }

      this.logger.log(`Updating currency with ID: ${id}`);

      // Check if currency exists
      const existingCurrency = await queryRunner.manager.findOne(Currency, {
        where: { id, status: 1 }
      });

      if (!existingCurrency) {
        throw new NotFoundException(`Currency with ID ${id} not found or is inactive`);
      }

      // Validate update fields if provided
      if (updateCurrencyDto.currency !== undefined) {
        if (typeof updateCurrencyDto.currency !== 'string' || updateCurrencyDto.currency.trim().length === 0) {
          throw new BadRequestException('Currency name must be a non-empty string');
        }
        updateCurrencyDto.currency = updateCurrencyDto.currency.trim();
      }

      if (updateCurrencyDto.code !== undefined) {
        if (typeof updateCurrencyDto.code !== 'string' || updateCurrencyDto.code.trim().length === 0) {
          throw new BadRequestException('Currency code must be a non-empty string');
        }
        const normalizedCode = updateCurrencyDto.code.trim().toUpperCase();

        // Check if code already exists for another currency
        const existingCurrencyWithCode = await queryRunner.manager
          .createQueryBuilder(Currency, 'currency')
          .where('currency.code = :code', { code: normalizedCode })
          .andWhere('currency.id != :id', { id })
          .getOne();

        if (existingCurrencyWithCode) {
          throw new ConflictException(`Currency with code '${normalizedCode}' already exists`);
        }
        updateCurrencyDto.code = normalizedCode;
      }

      if (updateCurrencyDto.symbol !== undefined) {
        if (typeof updateCurrencyDto.symbol !== 'string' || updateCurrencyDto.symbol.trim().length === 0) {
          throw new BadRequestException('Currency symbol must be a non-empty string');
        }
        updateCurrencyDto.symbol = updateCurrencyDto.symbol.trim();
      }

      Object.assign(existingCurrency, updateCurrencyDto);
      const updatedCurrency = await queryRunner.manager.save(Currency, existingCurrency);

      await queryRunner.commitTransaction();
      this.logger.log(`Updated currency: ${updatedCurrency.currency}`);
      return updatedCurrency;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error updating currency with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update currency in database');
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
        throw new BadRequestException('Invalid currency ID provided. Must be a positive number');
      }

      this.logger.log(`Deleting currency with ID: ${id}`);

      // Check if currency exists
      const currency = await queryRunner.manager.findOne(Currency, {
        where: { id, status: 1 }
      });

      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found or is inactive`);
      }

      await queryRunner.manager.remove(Currency, currency);

      await queryRunner.commitTransaction();
      this.logger.log(`Deleted currency: ${currency.currency}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting currency with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete currency from database');
    } finally {
      await queryRunner.release();
    }
  }

  async softDelete(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid currency ID provided. Must be a positive number');
      }

      this.logger.log(`Soft deleting currency with ID: ${id}`);

      // First check if currency exists and is active
      const currency = await queryRunner.manager.findOne(Currency, {
        where: { id, status: 1 }
      });

      if (!currency) {
        throw new NotFoundException(`Currency with ID ${id} not found or is already inactive`);
      }

      const result = await queryRunner.manager.update(Currency, id, { status: 0 });

      if (result.affected === 0) {
        throw new NotFoundException(`Failed to soft delete currency with ID ${id}`);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Soft deleted currency: ${currency.currency} (ID: ${id})`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error soft deleting currency with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to soft delete currency in database');
    } finally {
      await queryRunner.release();
    }
  }
} 