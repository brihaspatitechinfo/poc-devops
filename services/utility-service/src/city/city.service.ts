import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name);

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<City[]> {
    try {
      this.logger.log('Fetching all cities');
      const cities = await this.cityRepository.find({
        relations: ['state'],
        order: { name: 'ASC' },
      });
      
      if (!cities || cities.length === 0) {
        this.logger.warn('No cities found in the system');
        return [];
      }
      
      // Check if state relations are properly loaded
      const citiesWithMissingStates = cities.filter(city => !city.state);
      if (citiesWithMissingStates.length > 0) {
        this.logger.warn(`${citiesWithMissingStates.length} cities have missing state relations`);
      }
      
      this.logger.log(`Found ${cities.length} cities`);
      return cities;
    } catch (error) {
      this.logger.error(`Failed to fetch cities: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching cities: ${error.message}`);
    }
  }

  async findAllWithFilters(filters: any): Promise<City[]> {
    try {
      this.logger.log('Fetching cities with filters:', filters);
      
      // Validate filters
      if (!filters || typeof filters !== 'object') {
        throw new BadRequestException('Invalid filters provided');
      }
      
      const queryBuilder = this.cityRepository.createQueryBuilder('city')
        .leftJoinAndSelect('city.state', 'state');
      
      // Filter by state ID
      if (filters.stateId) {
        // Convert string to number if needed
        const stateId = typeof filters.stateId === 'string' ? parseInt(filters.stateId, 10) : filters.stateId;
        
        if (isNaN(stateId) || stateId <= 0) {
          throw new BadRequestException('Invalid state ID provided. Must be a positive number');
        }
        queryBuilder.andWhere('city.stateId = :stateId', { stateId });
      }
      
      // Filter by country ID
      if (filters.countryId) {
        // Convert string to number if needed
        const countryId = typeof filters.countryId === 'string' ? parseInt(filters.countryId, 10) : filters.countryId;
        
        if (isNaN(countryId) || countryId <= 0) {
          throw new BadRequestException('Invalid country ID provided. Must be a positive number');
        }
        queryBuilder.andWhere('city.countryId = :countryId', { countryId });
      }
      
      // Search by city name
      if (filters.search) {
        if (typeof filters.search !== 'string' || filters.search.trim().length === 0) {
          throw new BadRequestException('Invalid search term provided');
        }
        queryBuilder.andWhere('city.name LIKE :search', { search: `%${filters.search.trim()}%` });
      }
      
      // Order by name
      queryBuilder.orderBy('city.name', 'ASC');
      
      const cities = await queryBuilder.getMany();
      
      // Check if any results found when specific filters are applied
      if (cities.length === 0) {
        const appliedFilters = Object.keys(filters).filter(key => 
          filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
        );
        
        if (appliedFilters.length > 0) {
          this.logger.warn(`No cities found with the provided filters: ${JSON.stringify(filters)}`);
          throw new NotFoundException(`No cities found matching the provided criteria: ${appliedFilters.join(', ')}`);
        }
      }
      
      this.logger.log(`Found ${cities.length} cities with filters`);
      return cities;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch cities with filters: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching cities with filters: ${error.message}`);
    }
  }

  async findById(id: number): Promise<City> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid city ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching city with ID: ${id}`);
      const city = await this.cityRepository.findOne({
        where: { id },
        relations: ['state'],
      });
      
      if (!city) {
        throw new NotFoundException(`City with ID ${id} not found`);
      }
      
      // Check if state relation is properly loaded
      if (!city.state) {
        this.logger.warn(`State relation not loaded for city ID ${id}`);
        throw new BadRequestException(`City data is incomplete. State information not available for city ID ${id}`);
      }
      
      this.logger.log(`Found city: ${city.name} in state: ${city.state.name}`);
      return city;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch city with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the city: ${error.message}`);
    }
  }

  async findByStateId(stateId: number): Promise<City[]> {
    try {
      // Validate input
      if (!stateId || typeof stateId !== 'number' || stateId <= 0) {
        throw new BadRequestException('Invalid state ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching cities for state ID: ${stateId}`);
      const cities = await this.cityRepository.find({
        where: { stateId },
        order: { name: 'ASC' },
      });
      
      if (!cities || cities.length === 0) {
        this.logger.log(`No cities found for state ID ${stateId}`);
        return [];
      }
      
      this.logger.log(`Found ${cities.length} cities for state ID ${stateId}`);
      return cities;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch cities for state ID ${stateId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching cities for state: ${error.message}`);
    }
  }

  async findByCountryId(countryId: number): Promise<City[]> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching cities for country ID: ${countryId}`);
      const cities = await this.cityRepository.find({
        where: { countryId },
        order: { name: 'ASC' },
      });
      
      if (!cities || cities.length === 0) {
        this.logger.log(`No cities found for country ID ${countryId}`);
        return [];
      }
      
      this.logger.log(`Found ${cities.length} cities for country ID ${countryId}`);
      return cities;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch cities for country ID ${countryId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching cities for country: ${error.message}`);
    }
  }

  async getCitiesByState(stateId: number): Promise<Array<{ id: number; name: string }>> {
    try {
      // Validate input
      if (!stateId || typeof stateId !== 'number' || stateId <= 0) {
        throw new BadRequestException('Invalid state ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching cities for state ID: ${stateId}`);
      const cities = await this.cityRepository.find({
        where: { stateId },
        select: ['id', 'name'],
        order: { name: 'ASC' },
      });
      
      if (!cities || cities.length === 0) {
        this.logger.log(`No cities found for state ID ${stateId}`);
        return [];
      }
      
      this.logger.log(`Found ${cities.length} cities for state ID ${stateId}`);
      return cities;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch cities for state ID ${stateId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching cities for state: ${error.message}`);
    }
  }

  async getCitiesByCountry(countryId: number): Promise<Array<{ id: number; name: string }>> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching cities for country ID: ${countryId}`);
      const cities = await this.cityRepository.find({
        where: { countryId },
        select: ['id', 'name'],
        order: { name: 'ASC' },
      });
      
      if (!cities || cities.length === 0) {
        this.logger.log(`No cities found for country ID ${countryId}`);
        return [];
      }
      
      this.logger.log(`Found ${cities.length} cities for country ID ${countryId}`);
      return cities;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch cities for country ID ${countryId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching cities for country: ${error.message}`);
    }
  }

  async create(createCityDto: Partial<City>): Promise<City> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!createCityDto || typeof createCityDto !== 'object') {
        throw new BadRequestException('Invalid city data provided');
      }
      
      // Validate required fields
      if (!createCityDto.name || typeof createCityDto.name !== 'string' || createCityDto.name.trim().length === 0) {
        throw new BadRequestException('City name is required and must be a non-empty string');
      }
      
      if (!createCityDto.stateId || typeof createCityDto.stateId !== 'number' || createCityDto.stateId <= 0) {
        throw new BadRequestException('State ID is required and must be a positive number');
      }
      
      // Check if city name already exists in the same state
      const existingCity = await queryRunner.manager.findOne(City, {
        where: { 
          name: createCityDto.name.trim(),
          stateId: createCityDto.stateId
        }
      });
      
      if (existingCity) {
        throw new ConflictException(`City with name '${createCityDto.name.trim()}' already exists in this state`);
      }
      
      // Normalize data
      const normalizedData = {
        ...createCityDto,
        name: createCityDto.name.trim(),
        stateId: createCityDto.stateId,
        countryId: createCityDto.countryId || null
      };
      
      this.logger.log('Creating new city');
      const city = queryRunner.manager.create(City, normalizedData);
      const savedCity = await queryRunner.manager.save(City, city);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Created city: ${savedCity.name}`);
      return savedCity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create city: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while creating the city: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateCityDto: Partial<City>): Promise<City> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid city ID provided. Must be a positive number');
      }
      
      if (!updateCityDto || typeof updateCityDto !== 'object') {
        throw new BadRequestException('Invalid update data provided');
      }
      
      this.logger.log(`Updating city with ID: ${id}`);
      
      // Check if city exists
      const existingCity = await queryRunner.manager.findOne(City, {
        where: { id }
      });
      
      if (!existingCity) {
        throw new NotFoundException(`City with ID ${id} not found`);
      }
      
      // Validate update fields if provided
      if (updateCityDto.name !== undefined) {
        if (typeof updateCityDto.name !== 'string' || updateCityDto.name.trim().length === 0) {
          throw new BadRequestException('City name must be a non-empty string');
        }
        const normalizedName = updateCityDto.name.trim();
        
        // Check if name already exists for another city in the same state
        const existingCityWithName = await queryRunner.manager
          .createQueryBuilder(City, 'city')
          .where('city.name = :name', { name: normalizedName })
          .andWhere('city.stateId = :stateId', { stateId: existingCity.stateId })
          .andWhere('city.id != :id', { id })
          .getOne();
        
        if (existingCityWithName) {
          throw new ConflictException(`City with name '${normalizedName}' already exists in this state`);
        }
        updateCityDto.name = normalizedName;
      }
      
      if (updateCityDto.stateId !== undefined) {
        if (typeof updateCityDto.stateId !== 'number' || updateCityDto.stateId <= 0) {
          throw new BadRequestException('State ID must be a positive number');
        }
      }
      
      Object.assign(existingCity, updateCityDto);
      const updatedCity = await queryRunner.manager.save(City, existingCity);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Updated city: ${updatedCity.name}`);
      return updatedCity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error updating city with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update city in database');
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
        throw new BadRequestException('Invalid city ID provided. Must be a positive number');
      }
      
      this.logger.log(`Deleting city with ID: ${id}`);
      
      // Check if city exists
      const city = await queryRunner.manager.findOne(City, {
        where: { id }
      });
      
      if (!city) {
        throw new NotFoundException(`City with ID ${id} not found`);
      }
      
      await queryRunner.manager.remove(City, city);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Deleted city: ${city.name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting city with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete city from database');
    } finally {
      await queryRunner.release();
    }
  }
} 