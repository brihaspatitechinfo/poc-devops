import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { LocationMaster } from './location-master.entity';

@Injectable()
export class LocationMasterService {
  private readonly logger = new Logger(LocationMasterService.name);

  constructor(
    @InjectRepository(LocationMaster)
    private readonly locationMasterRepository: Repository<LocationMaster>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<LocationMaster[]> {
    try {
      this.logger.log('Fetching all locations');
      const locations = await this.locationMasterRepository.find({
        order: { sort: 'ASC', location: 'ASC' },
      });
      
      if (!locations || locations.length === 0) {
        this.logger.warn('No locations found in the system');
        return [];
      }
      
      this.logger.log(`Found ${locations.length} locations`);
      return locations;
    } catch (error) {
      this.logger.error(`Failed to fetch locations: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching locations: ${error.message}`);
    }
  }

  async findAllWithFilters(filters: any): Promise<LocationMaster[]> {
    try {
      this.logger.log('Fetching locations with filters:', filters);
      
      // Validate filters
      if (!filters || typeof filters !== 'object') {
        throw new BadRequestException('Invalid filters provided');
      }
      
      const queryBuilder = this.locationMasterRepository.createQueryBuilder('location');
      
      // Filter by country ID
      if (filters.countryId) {
        // Convert string to number if needed
        const countryId = typeof filters.countryId === 'string' ? parseInt(filters.countryId, 10) : filters.countryId;
        
        if (isNaN(countryId) || countryId <= 0) {
          throw new BadRequestException('Invalid country ID provided. Must be a positive number');
        }
        queryBuilder.andWhere('location.countryId = :countryId', { countryId });
      }
      
      // Search by location name
      if (filters.search) {
        if (typeof filters.search !== 'string' || filters.search.trim().length === 0) {
          throw new BadRequestException('Invalid search term provided');
        }
        queryBuilder.andWhere('location.location LIKE :search', { search: `%${filters.search.trim()}%` });
      }
      
      // Filter by specific IDs
      if (filters.ids) {
        if (typeof filters.ids !== 'string' || filters.ids.trim().length === 0) {
          throw new BadRequestException('Invalid IDs provided. Must be a comma-separated string');
        }
        const idArray = filters.ids.split(',').map(id => {
          const parsedId = parseInt(id.trim());
          if (isNaN(parsedId) || parsedId <= 0) {
            throw new BadRequestException(`Invalid ID in list: ${id.trim()}`);
          }
          return parsedId;
        });
        queryBuilder.andWhere('location.id IN (:...ids)', { ids: idArray });
      }
      
      // Order by sort and location name
      queryBuilder.orderBy('location.sort', 'ASC');
      queryBuilder.addOrderBy('location.location', 'ASC');
      
      const locations = await queryBuilder.getMany();
      
      // Check if any results found when specific filters are applied
      if (locations.length === 0) {
        const appliedFilters = Object.keys(filters).filter(key => 
          filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
        );
        
        if (appliedFilters.length > 0) {
          this.logger.warn(`No locations found with the provided filters: ${JSON.stringify(filters)}`);
          throw new NotFoundException(`No locations found matching the provided criteria: ${appliedFilters.join(', ')}`);
        }
      }
      
      this.logger.log(`Found ${locations.length} locations with filters`);
      return locations;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch locations with filters: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching locations with filters: ${error.message}`);
    }
  }

  async findById(id: number): Promise<LocationMaster> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid location ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching location with ID: ${id}`);
      const location = await this.locationMasterRepository.findOne({
        where: { id },
      });
      
      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }
      
      this.logger.log(`Found location: ${location.location}`);
      return location;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch location with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the location: ${error.message}`);
    }
  }

  async findByCountryId(countryId: number): Promise<LocationMaster[]> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching locations for country ID: ${countryId}`);
      const locations = await this.locationMasterRepository.find({
        where: { countryId },
        order: { sort: 'ASC', location: 'ASC' },
      });
      
      if (!locations || locations.length === 0) {
        this.logger.log(`No locations found for country ID ${countryId}`);
        return [];
      }
      
      this.logger.log(`Found ${locations.length} locations for country ID ${countryId}`);
      return locations;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch locations for country ID ${countryId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching locations for country: ${error.message}`);
    }
  }

  async getLocationList(): Promise<Array<{ id: number; location: string }>> {
    try {
      this.logger.log('Fetching location list');
      const locations = await this.locationMasterRepository.find({
        select: ['id', 'location'],
        order: { location: 'ASC' },
      });
      
      if (!locations || locations.length === 0) {
        this.logger.warn('No locations found in the system');
        return [];
      }
      
      this.logger.log(`Found ${locations.length} locations`);
      return locations;
    } catch (error) {
      this.logger.error(`Failed to fetch location list: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching location list: ${error.message}`);
    }
  }

  async getLocationListByCountry(countryId: number): Promise<Array<{ id: number; location: string }>> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching location list for country ID: ${countryId}`);
      const locations = await this.locationMasterRepository.find({
        where: { countryId },
        select: ['id', 'location'],
        order: { location: 'ASC' },
      });
      
      if (!locations || locations.length === 0) {
        this.logger.log(`No locations found for country ID ${countryId}`);
        return [];
      }
      
      this.logger.log(`Found ${locations.length} locations for country ID ${countryId}`);
      return locations;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch location list for country ID ${countryId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching location list for country: ${error.message}`);
    }
  }

  async getLocationNameById(ids: number[]): Promise<string[]> {
    try {
      // Validate input
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new BadRequestException('Invalid IDs provided. Must be a non-empty array of numbers');
      }
      
      // Validate each ID
      for (const id of ids) {
        if (typeof id !== 'number' || id <= 0) {
          throw new BadRequestException(`Invalid ID in array: ${id}. Must be a positive number`);
        }
      }
      
      this.logger.log(`Fetching location names for IDs: ${ids.join(', ')}`);
      const locations = await this.locationMasterRepository.find({
        where: { id: In(ids) },
        select: ['location'],
      });
      
      if (!locations || locations.length === 0) {
        this.logger.log(`No locations found for the provided IDs: ${ids.join(', ')}`);
        return [];
      }
      
      const locationNames = locations.map(location => location.location);
      this.logger.log(`Found ${locationNames.length} location names`);
      return locationNames;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch location names for IDs ${ids.join(', ')}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching location names: ${error.message}`);
    }
  }

  async create(createLocationDto: Partial<LocationMaster>): Promise<LocationMaster> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!createLocationDto || typeof createLocationDto !== 'object') {
        throw new BadRequestException('Invalid location data provided');
      }
      
      // Validate required fields
      if (!createLocationDto.location || typeof createLocationDto.location !== 'string' || createLocationDto.location.trim().length === 0) {
        throw new BadRequestException('Location name is required and must be a non-empty string');
      }
      
      // Check if location with same name already exists
      const existingLocation = await queryRunner.manager.findOne(LocationMaster, {
        where: { location: createLocationDto.location.trim() }
      });
      
      if (existingLocation) {
        throw new ConflictException(`Location with name '${createLocationDto.location.trim()}' already exists`);
      }
      
      // Normalize data
      const normalizedData = {
        ...createLocationDto,
        location: createLocationDto.location.trim(),
        countryId: createLocationDto.countryId || null,
        sort: createLocationDto.sort || 0
      };
      
      this.logger.log('Creating new location');
      const location = queryRunner.manager.create(LocationMaster, normalizedData);
      const savedLocation = await queryRunner.manager.save(LocationMaster, location);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Created location: ${savedLocation.location}`);
      return savedLocation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create location: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while creating the location: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateLocationDto: Partial<LocationMaster>): Promise<LocationMaster> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid location ID provided. Must be a positive number');
      }
      
      if (!updateLocationDto || typeof updateLocationDto !== 'object') {
        throw new BadRequestException('Invalid update data provided');
      }
      
      this.logger.log(`Updating location with ID: ${id}`);
      
      // Check if location exists
      const existingLocation = await queryRunner.manager.findOne(LocationMaster, {
        where: { id }
      });
      
      if (!existingLocation) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }
      
      // Validate update fields if provided
      if (updateLocationDto.location !== undefined) {
        if (typeof updateLocationDto.location !== 'string' || updateLocationDto.location.trim().length === 0) {
          throw new BadRequestException('Location name must be a non-empty string');
        }
        const normalizedName = updateLocationDto.location.trim();
        
        // Check if location name already exists
        const existingLocationWithName = await queryRunner.manager
          .createQueryBuilder(LocationMaster, 'location')
          .where('location.location = :name', { name: normalizedName })
          .andWhere('location.id != :id', { id })
          .getOne();
        
        if (existingLocationWithName) {
          throw new ConflictException(`Location with name '${normalizedName}' already exists`);
        }
        updateLocationDto.location = normalizedName;
      }
      
      if (updateLocationDto.countryId !== undefined) {
        if (typeof updateLocationDto.countryId !== 'number' || updateLocationDto.countryId <= 0) {
          throw new BadRequestException('Country ID must be a positive number');
        }
      }
      
      if (updateLocationDto.sort !== undefined) {
        if (typeof updateLocationDto.sort !== 'number' || updateLocationDto.sort < 0) {
          throw new BadRequestException('Sort value must be a non-negative number');
        }
      }
      
      Object.assign(existingLocation, updateLocationDto);
      const updatedLocation = await queryRunner.manager.save(LocationMaster, existingLocation);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Updated location: ${updatedLocation.location}`);
      return updatedLocation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error updating location with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update location in database');
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
        throw new BadRequestException('Invalid location ID provided. Must be a positive number');
      }
      
      this.logger.log(`Deleting location with ID: ${id}`);
      
      // Check if location exists
      const location = await queryRunner.manager.findOne(LocationMaster, {
        where: { id }
      });
      
      if (!location) {
        throw new NotFoundException(`Location with ID ${id} not found`);
      }
      
      await queryRunner.manager.remove(LocationMaster, location);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Deleted location: ${location.location}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting location with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete location from database');
    } finally {
      await queryRunner.release();
    }
  }
} 