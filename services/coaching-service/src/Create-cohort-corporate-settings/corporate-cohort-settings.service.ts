import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, ConflictException ,Logger} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WitSelectCorporateCohortSettings } from './entities/wit-select-corporate-cohort-settings.entity';
import { CreateCorporateCohortSettingsDto } from './dto/create-corporate-cohort-settings.dto';
import { WitSelectCorporateUnlimitedPrices } from './entities/wit-select-corporate-unlimited-prices.entity';
import { CreateCorporateUnlimitedPricesDto } from './dto/create-corporate-unlimited-prices.dto';
import { YesNo, EnableDuration } from './enums/corporate-cohort-settings.enums';

@Injectable()
export class CorporateCohortSettingsService {
  constructor(
    @InjectRepository(WitSelectCorporateCohortSettings)
    private readonly corporateCohortSettingsRepository: Repository<WitSelectCorporateCohortSettings>,
    @InjectRepository(WitSelectCorporateUnlimitedPrices)
    private readonly unlimitedPricesRepository: Repository<WitSelectCorporateUnlimitedPrices>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
// --- Cohort Settings Logic ---
async create(dto: CreateCorporateCohortSettingsDto) {
  try {
    return await this.dataSource.transaction(async manager => {
      // Check for duplicate corporateId
      const existing = await manager.findOne(WitSelectCorporateCohortSettings, { where: { corporateId: dto.corporateId } });
      if (existing) {
        throw new BadRequestException('A cohort setting for this corporateId already exists.');
      }
      if (dto.isUnlimited === YesNo.YES) {
        if (!dto.unlimitedPrices || !Array.isArray(dto.unlimitedPrices) || dto.unlimitedPrices.length === 0) {
          throw new BadRequestException('unlimitedPrices array is required when isUnlimited is 1 (unlimited)');
        }
      }
      if (dto.isUnlimited === YesNo.NO && dto.unlimitedPrices && Array.isArray(dto.unlimitedPrices) && dto.unlimitedPrices.length > 0) {
        throw new BadRequestException('unlimitedPrices should not be provided when isUnlimited is 0');
      }
      if (dto.chemistrySessionStatus === YesNo.YES && (dto.chemistrySessionCount === undefined || dto.chemistrySessionCount < 1 || dto.chemistrySessionCount > 10)) {
        throw new BadRequestException('chemistrySessionCount (1-10) is required when chemistrySessionStatus is 1');
      }
      if (dto.chemistrySessionStatus === YesNo.NO && dto.chemistrySessionCount !== undefined) {
        throw new BadRequestException('chemistrySessionCount should not be provided when chemistrySessionStatus is 0 if chemistrySessionCount Present ');
      }
      const entity = manager.create(WitSelectCorporateCohortSettings, {...dto,
        sessionDurationKeys: dto.sessionDurationKeys,
      });
      const savedSettings = await manager.save(WitSelectCorporateCohortSettings, entity);
      if (dto.isUnlimited === YesNo.YES && dto.unlimitedPrices && Array.isArray(dto.unlimitedPrices)) {
        for (const price of dto.unlimitedPrices) {
          await manager.save(WitSelectCorporateUnlimitedPrices, manager.create(WitSelectCorporateUnlimitedPrices, {
            corporateId: savedSettings.corporateId,
            month: price.month,
            price: price.price,
          }));
        }
      }
      return savedSettings;
    });
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to create corporate cohort settings: ' + error.message);
  }
}
// --- Cohort Settings CRUD ---
async findAll(): Promise<WitSelectCorporateCohortSettings[]> {
  try {
    return await this.corporateCohortSettingsRepository.find({ order: { id: 'ASC' } });
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch all corporate cohort settings: ' + error.message);
  }
}

async findOne(id: number): Promise<WitSelectCorporateCohortSettings> {
  try {
    const result = await this.corporateCohortSettingsRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Corporate cohort setting not found');
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to fetch corporate cohort setting: ' + error.message);
  }
}

async update(id: number, updateDto: Partial<CreateCorporateCohortSettingsDto>): Promise<void> {
  const logger = new Logger('CorporateCohortSettingsService');
  try {
    await this.dataSource.transaction(async manager => {
      // Normalize values before DB update
      if (updateDto.cohortType && !Array.isArray(updateDto.cohortType)) {
        updateDto.cohortType = [updateDto.cohortType];
      }
      if (updateDto.coachSearchType && !Array.isArray(updateDto.coachSearchType)) {
        updateDto.coachSearchType = [updateDto.coachSearchType];
      }
      if (updateDto.enableDuration === EnableDuration.DISABLED) {
        updateDto.sessionDurationKeys = [];
      }
      // Update entity
      await manager.update(WitSelectCorporateCohortSettings, id, updateDto);
      const updated = await manager.findOne(WitSelectCorporateCohortSettings, { where: { id } });
      // Validation: chemistry session rules
      const chemistrySessionStatus = updateDto.chemistrySessionStatus ?? updated.chemistrySessionStatus;
      const chemistrySessionCount = updateDto.chemistrySessionCount ?? updated.chemistrySessionCount;
      if (
        chemistrySessionStatus === YesNo.YES &&
        (chemistrySessionCount === undefined || chemistrySessionCount < 1 || chemistrySessionCount > 10)
      ) {
        throw new BadRequestException('chemistrySessionCount (1-10) is required when chemistrySessionStatus is 1');
      }
      if (updateDto.chemistrySessionStatus === YesNo.NO && updateDto.chemistrySessionCount !== undefined) {
        throw new BadRequestException('chemistrySessionCount should not be provided when chemistrySessionStatus is 0');
      }
      // Validation: sessionDurationKeys required if enableDuration is 1
      const enableDuration = updateDto.enableDuration !== undefined ? updateDto.enableDuration : updated.enableDuration;
      const sessionDurationKeys = updateDto.sessionDurationKeys !== undefined ? updateDto.sessionDurationKeys : updated.sessionDurationKeys;
      if (enableDuration === EnableDuration.ENABLED && (!Array.isArray(sessionDurationKeys) || sessionDurationKeys.length === 0)) {
        throw new BadRequestException('sessionDurationKeys must be a non-empty array when enableDuration is 1');
      }
      // Handle unlimited prices
      if (updateDto.isUnlimited === YesNo.NO) {
        await manager.delete(WitSelectCorporateUnlimitedPrices, { corporateId: updated.corporateId });
      } else if (updateDto.isUnlimited === YesNo.YES && Array.isArray(updateDto.unlimitedPrices)) {
        await manager.delete(WitSelectCorporateUnlimitedPrices, { corporateId: updated.corporateId });
        await Promise.all(
          updateDto.unlimitedPrices.map(price =>
            manager.save(WitSelectCorporateUnlimitedPrices, manager.create(WitSelectCorporateUnlimitedPrices, {
              corporateId: updated.corporateId,
              month: price.month,
              price: price.price,
            }))
          )
        );
      }
      logger.log(`Updated corporate cohort settings [id=${id}] successfully.`);
    });
  } catch (error) {
    logger.error(`Failed to update corporate cohort settings [id=${id}]: ${error.message}`, error.stack);
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to update corporate cohort settings: ' + error.message);
  }
}
async remove(id: number): Promise<void> {
  try {
    await this.dataSource.transaction(async manager => {
      const setting = await manager.findOne(WitSelectCorporateCohortSettings, { where: { id } });
      if (!setting) {
        throw new NotFoundException('Corporate cohort setting not found');
      }
      // Delete all unlimited prices for this corporate
      await manager.delete(WitSelectCorporateUnlimitedPrices, { corporateId: setting.corporateId });
      await manager.delete(WitSelectCorporateCohortSettings, id);
    });
  } catch (error) {
    if (
      error instanceof NotFoundException 
    ) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to delete corporate cohort settings: ' + error.message);
  }
}


  private async createUnlimitedPrice(createDto: CreateCorporateUnlimitedPricesDto): Promise<WitSelectCorporateUnlimitedPrices> {
    try {
      const price = this.unlimitedPricesRepository.create(createDto);
      return await this.unlimitedPricesRepository.save(price);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create unlimited price: ' + error.message);
    }
  }

  async findAllUnlimitedPrices(): Promise<WitSelectCorporateUnlimitedPrices[]> {
    try {
      return await this.unlimitedPricesRepository.find({ order: { id: 'ASC' } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch all unlimited prices: ' + error.message);
    }
  }

  async findUnlimitedPricesByCorporateId(corporateId: string | number): Promise<WitSelectCorporateUnlimitedPrices[]> {
    try {
      // Convert to string since the database field is varchar
      const corporateIdString = String(corporateId);
      return await this.unlimitedPricesRepository.find({ where: { corporateId: corporateIdString }, order: { month: 'ASC' } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch unlimited prices for the corporate: ' + error.message);
    }
  }

  async findUnlimitedPriceOne(id: number): Promise<WitSelectCorporateUnlimitedPrices> {
    try {
      const result = await this.unlimitedPricesRepository.findOne({ where: { id } });
      if (!result) {
        throw new NotFoundException('Unlimited price entry not found');
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch unlimited price entry: ' + error.message);
    }
  }

}