import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { State } from './state.entity';

@Injectable()
export class StateService {
  private readonly logger = new Logger(StateService.name);

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<State[]> {
    try {
      this.logger.log('Fetching all states');
      const states = await this.stateRepository.find({
        relations: ['country', 'cities'],
        order: { name: 'ASC' },
      });
      
      if (!states || states.length === 0) {
        this.logger.warn('No states found in the system');
        return [];
      }
      
      // Check if relations are properly loaded
      const statesWithMissingCountry = states.filter(state => !state.country);
      const statesWithMissingCities = states.filter(state => !state.cities);
      
      if (statesWithMissingCountry.length > 0) {
        this.logger.warn(`${statesWithMissingCountry.length} states have missing country relations`);
      }
      
      if (statesWithMissingCities.length > 0) {
        this.logger.warn(`${statesWithMissingCities.length} states have missing cities relations`);
      }
      
      this.logger.log(`Found ${states.length} states`);
      return states;
    } catch (error) {
      this.logger.error(`Failed to fetch states: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching states: ${error.message}`);
    }
  }

  async findAllWithFilters(filters: any): Promise<State[]> {
    try {
      this.logger.log('Fetching states with filters:', filters);
      
      // Validate filters
      if (!filters || typeof filters !== 'object') {
        throw new BadRequestException('Invalid filters provided');
      }
      
      const queryBuilder = this.stateRepository.createQueryBuilder('state')
        .leftJoinAndSelect('state.country', 'country')
        .leftJoinAndSelect('state.cities', 'cities');
      
      // Filter by country ID
      if (filters.countryId) {
        // Convert string to number if needed
        const countryId = typeof filters.countryId === 'string' ? parseInt(filters.countryId, 10) : filters.countryId;
        
        if (isNaN(countryId) || countryId <= 0) {
          throw new BadRequestException('Invalid country ID provided. Must be a positive number');
        }
        queryBuilder.andWhere('state.countryId = :countryId', { countryId });
      }
      
      // Search by state name
      if (filters.search) {
        if (typeof filters.search !== 'string' || filters.search.trim().length === 0) {
          throw new BadRequestException('Invalid search term provided');
        }
        queryBuilder.andWhere('state.name LIKE :search', { search: `%${filters.search.trim()}%` });
      }
      
      // Order by name
      queryBuilder.orderBy('state.name', 'ASC');
      
      const states = await queryBuilder.getMany();
      
      // Check if any results found when specific filters are applied
      if (states.length === 0) {
        const appliedFilters = Object.keys(filters).filter(key => 
          filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
        );
        
        if (appliedFilters.length > 0) {
          this.logger.warn(`No states found with the provided filters: ${JSON.stringify(filters)}`);
          throw new NotFoundException(`No states found matching the provided criteria: ${appliedFilters.join(', ')}`);
        }
      }
      
      this.logger.log(`Found ${states.length} states with filters`);
      return states;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch states with filters: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching states with filters: ${error.message}`);
    }
  }

  async findById(id: number): Promise<State> {
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid state ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching state with ID: ${id}`);
      const state = await this.stateRepository.findOne({
        where: { id },
        relations: ['country', 'cities'],
      });
      
      if (!state) {
        throw new NotFoundException(`State with ID ${id} not found`);
      }
      
      // Check if relations are properly loaded
      if (!state.country) {
        this.logger.warn(`Country relation not loaded for state ID ${id}`);
        throw new BadRequestException(`State data is incomplete. Country information not available for state ID ${id}`);
      }
      
      if (!state.cities) {
        this.logger.warn(`Cities relation not loaded for state ID ${id}`);
        throw new BadRequestException(`State data is incomplete. Cities information not available for state ID ${id}`);
      }
      
      // Validate relations data
      if (Array.isArray(state.cities) && state.cities.length === 0) {
        this.logger.log(`State ID ${id} has no associated cities`);
      }
      
      this.logger.log(`Found state: ${state.name} in country: ${state.country.name} with ${state.cities?.length || 0} cities`);
      return state;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch state with ID ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching the state: ${error.message}`);
    }
  }

  async findByCountryId(countryId: number): Promise<State[]> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching states for country ID: ${countryId}`);
      const states = await this.stateRepository.find({
        where: { countryId },
        relations: ['cities'],
        order: { name: 'ASC' },
      });
      
      if (!states || states.length === 0) {
        this.logger.log(`No states found for country ID ${countryId}`);
        return [];
      }
      
      this.logger.log(`Found ${states.length} states for country ID ${countryId}`);
      return states;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch states for country ID ${countryId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching states for country: ${error.message}`);
    }
  }

  async getStatesByCountry(countryId: number): Promise<Array<{ id: number; name: string }>> {
    try {
      // Validate input
      if (!countryId || typeof countryId !== 'number' || countryId <= 0) {
        throw new BadRequestException('Invalid country ID provided. Must be a positive number');
      }
      
      this.logger.log(`Fetching states for country ID: ${countryId}`);
      const states = await this.stateRepository.find({
        where: { countryId },
        select: ['id', 'name'],
        order: { name: 'ASC' },
      });
      
      if (!states || states.length === 0) {
        this.logger.log(`No states found for country ID ${countryId}`);
        return [];
      }
      
      this.logger.log(`Found ${states.length} states for country ID ${countryId}`);
      return states;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to fetch states for country ID ${countryId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while fetching states for country: ${error.message}`);
    }
  }

  async create(createStateDto: Partial<State>): Promise<State> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!createStateDto || typeof createStateDto !== 'object') {
        throw new BadRequestException('Invalid state data provided');
      }
      
      // Validate required fields
      if (!createStateDto.name || typeof createStateDto.name !== 'string' || createStateDto.name.trim().length === 0) {
        throw new BadRequestException('State name is required and must be a non-empty string');
      }
      
      if (!createStateDto.countryId || typeof createStateDto.countryId !== 'number' || createStateDto.countryId <= 0) {
        throw new BadRequestException('Country ID is required and must be a positive number');
      }
      
      // Check if state name already exists for the same country
      const existingState = await queryRunner.manager.findOne(State, {
        where: { 
          name: createStateDto.name.trim(),
          countryId: createStateDto.countryId
        }
      });
      
      if (existingState) {
        throw new ConflictException(`State with name '${createStateDto.name.trim()}' already exists in this country`);
      }
      
      // Normalize data
      const normalizedData = {
        ...createStateDto,
        name: createStateDto.name.trim()
      };
      
      this.logger.log('Creating new state');
      const state = queryRunner.manager.create(State, normalizedData);
      const savedState = await queryRunner.manager.save(State, state);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Created state: ${savedState.name}`);
      return savedState;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create state: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`An error occurred while creating the state: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateStateDto: Partial<State>): Promise<State> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Validate input
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new BadRequestException('Invalid state ID provided. Must be a positive number');
      }
      
      if (!updateStateDto || typeof updateStateDto !== 'object') {
        throw new BadRequestException('Invalid update data provided');
      }
      
      this.logger.log(`Updating state with ID: ${id}`);
      
      // Check if state exists
      const existingState = await queryRunner.manager.findOne(State, {
        where: { id }
      });
      
      if (!existingState) {
        throw new NotFoundException(`State with ID ${id} not found`);
      }
      
      // Validate update fields if provided
      if (updateStateDto.name !== undefined) {
        if (typeof updateStateDto.name !== 'string' || updateStateDto.name.trim().length === 0) {
          throw new BadRequestException('State name must be a non-empty string');
        }
        const normalizedName = updateStateDto.name.trim();
        
        // Check if name already exists for another state in the same country
        const existingStateWithName = await queryRunner.manager
          .createQueryBuilder(State, 'state')
          .where('state.name = :name', { name: normalizedName })
          .andWhere('state.countryId = :countryId', { countryId: existingState.countryId })
          .andWhere('state.id != :id', { id })
          .getOne();
        
        if (existingStateWithName) {
          throw new ConflictException(`State with name '${normalizedName}' already exists in this country`);
        }
        updateStateDto.name = normalizedName;
      }
      
      Object.assign(existingState, updateStateDto);
      const updatedState = await queryRunner.manager.save(State, existingState);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Updated state: ${updatedState.name}`);
      return updatedState;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error updating state with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update state in database');
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
        throw new BadRequestException('Invalid state ID provided. Must be a positive number');
      }
      
      this.logger.log(`Deleting state with ID: ${id}`);
      
      // Check if state exists
      const state = await queryRunner.manager.findOne(State, {
        where: { id }
      });
      
      if (!state) {
        throw new NotFoundException(`State with ID ${id} not found`);
      }
      
      // Check if state has associated cities
      const stateWithCities = await queryRunner.manager.findOne(State, {
        where: { id },
        relations: ['cities']
      });
      
      if (stateWithCities && stateWithCities.cities && stateWithCities.cities.length > 0) {
        throw new BadRequestException(`Cannot delete state with ID ${id} because it has associated cities`);
      }
      
      await queryRunner.manager.remove(State, state);
      
      await queryRunner.commitTransaction();
      this.logger.log(`Deleted state: ${state.name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting state with ID ${id}: ${error.message}`);
      throw new BadRequestException('Failed to delete state from database');
    } finally {
      await queryRunner.release();
    }
  }
} 