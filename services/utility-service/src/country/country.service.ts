import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Country } from './country.entity';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Country[]> {
    try {
      this.logger.log('Fetching all countries');
      const countries = await this.countryRepository.find({
        where: { status: 1 },
        order: { name: 'ASC' },
      });
      
      if (!countries || countries.length === 0) {
        this.logger.warn('No active countries found in the system');
        return [];
      }
      
      this.logger.log(`Found ${countries.length} countries`);
      return countries;
    } catch (error) {
      this.logger.error(`Failed to fetch countries: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching countries: ${error.message}`);
    }
  }

  async findAllWithFilters(filters: any): Promise<Country[]> {
    try {
      this.logger.log('Fetching countries with filters:', filters);
      
      // Validate filters
      if (!filters || typeof filters !== 'object') {
        throw new BadRequestException('Invalid filters provided');
      }
      
      const queryBuilder = this.countryRepository.createQueryBuilder('country');
      
      // Base condition - only active countries
      queryBuilder.where('country.status = :status', { status: 1 });
      
      // Filter by active status
      if (filters.active !== undefined) {
        if (typeof filters.active !== 'boolean' && filters.active !== 'true' && filters.active !== 'false') {
          throw new BadRequestException('Invalid active filter value. Must be boolean or string "true"/"false"');
        }
        const isActive = filters.active === 'true' || filters.active === true;
        queryBuilder.andWhere('country.status = :activeStatus', { activeStatus: isActive ? 1 : 0 });
      }
      
      // Filter by shortname
      if (filters.shortname) {
        if (typeof filters.shortname !== 'string' || filters.shortname.trim().length === 0) {
          throw new BadRequestException('Invalid shortname provided');
        }
        queryBuilder.andWhere('country.shortname = :shortname', { shortname: filters.shortname.trim().toUpperCase() });
      }
      
      // Filter by dial code
      if (filters.dialCode) {
        if (typeof filters.dialCode !== 'string' || filters.dialCode.trim().length === 0) {
          throw new BadRequestException('Invalid dial code provided');
        }
        queryBuilder.andWhere('country.dialCode = :dialCode', { dialCode: filters.dialCode.trim() });
      }
      
      // Search by name
      if (filters.search) {
        if (typeof filters.search !== 'string' || filters.search.trim().length === 0) {
          throw new BadRequestException('Invalid search term provided');
        }
        queryBuilder.andWhere('country.name LIKE :search', { search: `%${filters.search.trim()}%` });
      }
      
      // Order by name
      queryBuilder.orderBy('country.name', 'ASC');
      
      const countries = await queryBuilder.getMany();
      
      // Check if any results found when specific filters are applied
      if (countries.length === 0) {
        const appliedFilters = Object.keys(filters).filter(key => 
          filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
        );
        
        if (appliedFilters.length > 0) {
          this.logger.warn(`No countries found with the provided filters: ${JSON.stringify(filters)}`);
          throw new NotFoundException(`No countries found matching the provided criteria: ${appliedFilters.join(', ')}`);
        }
      }
      
      this.logger.log(`Found ${countries.length} countries with filters`);
      return countries;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching countries with filters: ${error.message}`);
      throw new BadRequestException('Failed to fetch countries from database');
    }
  }

  async findById(id: number): Promise<Country> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching country with ID: ${id}`);
      const country = await this.countryRepository.findOne({
        where: { id, status: 1 },
        relations: ['states'],
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found or is inactive`);
      }
      
      // Check if relations are properly loaded
      if (!country.states) {
        this.logger.warn(`States relation not loaded for country ID ${id}`);
        throw new BadRequestException(`Country data is incomplete. States information not available for country ID ${id}`);
      }
      
      // Validate relations data
      if (Array.isArray(country.states) && country.states.length === 0) {
        this.logger.log(`Country ID ${id} has no associated states`);
      }
      
      this.logger.log(`Found country: ${country.name} with ${country.states?.length || 0} states`);
      return country;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching country with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to fetch country from database');
    }
  }

  async findByShortName(shortname: string): Promise<Country> {
    try {
      // Validate input
      if (!shortname || typeof shortname !== 'string' || shortname.trim().length === 0) {
        throw new BadRequestException('Invalid shortname provided. Must be a non-empty string');
      }
      
      const normalizedShortname = shortname.trim().toUpperCase();
      this.logger.log(`Fetching country with shortname: ${normalizedShortname}`);
      
      const country = await this.countryRepository.findOne({
        where: { shortname: normalizedShortname, status: 1 },
      });
      
      if (!country) {
        throw new NotFoundException(`Country with shortname '${normalizedShortname}' not found or is inactive`);
      }
      
      this.logger.log(`Found country: ${country.name}`);
      return country;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching country with shortname ${shortname}: ${error.message}`);
      throw new BadRequestException('Failed to fetch country from database');
    }
  }

  async getActiveCountries(): Promise<Country[]> {
    try {
      this.logger.log('Fetching active countries');
      const countries = await this.countryRepository.find({
        where: { status: 1 },
        select: ['id', 'name', 'shortname', 'dialCode'],
        order: { name: 'ASC' },
      });
      
      if (!countries || countries.length === 0) {
        this.logger.warn('No active countries found in the system');
        return [];
      }
      
      this.logger.log(`Found ${countries.length} active countries`);
      return countries;
    } catch (error) {
      this.logger.error(`Error fetching active countries: ${error.message}`);
      throw new BadRequestException('Failed to fetch active countries from database');
    }
  }

  async getCountryDialCodes(): Promise<Array<{ id: number; countryDial: string }>> {
    try {
      this.logger.log('Fetching country dial codes');
      const countries = await this.countryRepository
        .createQueryBuilder('country')
        .select([
          'country.id as id',
          'CONCAT(country.name, " (+", country.dialCode, ")") as countryDial'
        ])
        .where('country.status = :status', { status: 1 })
        .getRawMany();
      
      if (!countries || countries.length === 0) {
        this.logger.warn('No country dial codes found in the system');
        return [];
      }
      
      this.logger.log(`Found ${countries.length} country dial codes`);
      return countries;
    } catch (error) {
      this.logger.error(`Error fetching country dial codes: ${error.message}`);
      throw new BadRequestException('Failed to fetch country dial codes from database');
    }
  }

  async update(id: number, updateCountryDto: Partial<Country>): Promise<Country> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      if (!updateCountryDto || typeof updateCountryDto !== 'object') {
        throw new BadRequestException('Invalid update data provided');
      }
      
      this.logger.log(`Updating country with ID: ${id}`);
      
      // Check if country exists
      const existingCountry = await queryRunner.manager.findOne(Country, {
        where: { id, status: 1 }
      });
      
      if (!existingCountry) {
        throw new NotFoundException(`Country with ID ${id} not found or is inactive`);
      }
      
      // Validate update fields if provided
      if (updateCountryDto.name !== undefined) {
        if (typeof updateCountryDto.name !== 'string' || updateCountryDto.name.trim().length === 0) {
          throw new BadRequestException('Country name must be a non-empty string');
        }
        updateCountryDto.name = updateCountryDto.name.trim();
      }
      
      if (updateCountryDto.shortname !== undefined) {
        if (typeof updateCountryDto.shortname !== 'string' || updateCountryDto.shortname.trim().length === 0) {
          throw new BadRequestException('Country shortname must be a non-empty string');
        }
        const normalizedShortname = updateCountryDto.shortname.trim().toUpperCase();
        
        // Check if shortname already exists for another country
        const existingCountryWithShortname = await queryRunner.manager
          .createQueryBuilder(Country, 'country')
          .where('country.shortname = :shortname', { shortname: normalizedShortname })
          .andWhere('country.id != :id', { id })
          .getOne();
        
        if (existingCountryWithShortname) {
          throw new BadRequestException(`Country with shortname '${normalizedShortname}' already exists`);
        }
        updateCountryDto.shortname = normalizedShortname;
      }
      
      if (updateCountryDto.dialCode !== undefined) {
        if (updateCountryDto.dialCode !== null && (typeof updateCountryDto.dialCode !== 'number' || updateCountryDto.dialCode.toString().trim().length === 0)) {
          throw new BadRequestException('Country dial code must be null or a non-empty number');
        }
        updateCountryDto.dialCode = updateCountryDto.dialCode || null;
      }
      
      Object.assign(existingCountry, updateCountryDto);
      const updatedCountry = await queryRunner.manager.save(Country, existingCountry);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Updated country: ${updatedCountry.name}`);
      return updatedCountry;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating country with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update country in database');
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
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Deleting country with ID: ${id}`);
      
      // Check if country exists
      const country = await queryRunner.manager.findOne(Country, {
        where: { id, status: 1 }
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found or is inactive`);
      }
      
      // Check if country has associated states
      const countryWithStates = await queryRunner.manager.findOne(Country, {
        where: { id, status: 1 },
        relations: ['states']
      });
      
      if (countryWithStates && countryWithStates.states && countryWithStates.states.length > 0) {
        throw new BadRequestException(`Cannot delete country with ID ${id} because it has associated states`);
      }
      
      await queryRunner.manager.remove(Country, country);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Deleted country: ${country.name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting country with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete country from database');
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
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Soft deleting country with ID: ${id}`);
      
      // First check if country exists and is active
      const country = await queryRunner.manager.findOne(Country, {
        where: { id, status: 1 }
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found or is already inactive`);
      }
      
      const result = await queryRunner.manager.update(Country, id, { status: 0 });
      
      if (result.affected === 0) {
        throw new NotFoundException(`Failed to soft delete country with ID ${id}`);
      }
      
      await queryRunner.commitTransaction();
      this.logger.log(`Soft deleted country: ${country.name} (ID: ${id})`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error soft deleting country with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to soft delete country in database');
    } finally {
      await queryRunner.release();
    }
  }



  async findByIdWithoutRelations(id: number): Promise<Country> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching country with ID: ${id} (without relations)`);
      const country = await this.countryRepository.findOne({
        where: { id, status: 1 },
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found or is inactive`);
      }
      
      this.logger.log(`Found country: ${country.name}`);
      return country;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching country with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to fetch country from database');
    }
  }

  async checkIfCountryHasStates(countryId: number): Promise<boolean> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Checking if country with ID ${countryId} has associated states`);
      
      // First check if country exists
      const country = await this.countryRepository.findOne({
        where: { id: countryId, status: 1 },
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${countryId} not found or is inactive`);
      }
      
      // Check if country has states
      const countryWithStates = await this.countryRepository.findOne({
        where: { id: countryId, status: 1 },
        relations: ['states'],
      });
      
      if (!countryWithStates) {
        throw new BadRequestException(`Failed to load states relation for country ID ${countryId}`);
      }
      
      const hasStates = Array.isArray(countryWithStates.states) && countryWithStates.states.length > 0;
      this.logger.log(`Country with ID ${countryId} ${hasStates ? 'has' : 'does not have'} associated states`);
      return hasStates;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error checking if country has states for ID ${countryId}: ${error.message}`);
      throw new BadRequestException('Failed to check country states from database');
    }
  }

  async dialCodeToCountry(dialCode: number): Promise<Country> {
    try {
      const country = await this.countryRepository.findOne({
        where: { dialCode, status: 1 }, select: ['name', 'shortname']
      });
      if (!country) {
        throw new NotFoundException(`Country with dial code ${dialCode} not found or is inactive`);
      }
      return country;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching country with dial code ${dialCode}: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch country from database');
    }
  }

} 