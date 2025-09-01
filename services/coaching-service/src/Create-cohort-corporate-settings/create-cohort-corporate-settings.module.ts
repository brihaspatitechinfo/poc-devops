import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateCohortSettingsController } from './corporate-cohort-settings.controller';
import { CorporateCohortSettingsService } from './corporate-cohort-settings.service';
import { WitSelectCorporateCohortSettings } from './entities/wit-select-corporate-cohort-settings.entity';
import { WitSelectCorporateUnlimitedPrices } from './entities/wit-select-corporate-unlimited-prices.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WitSelectCorporateCohortSettings,
      WitSelectCorporateUnlimitedPrices,
    ]),
  ],
  controllers: [CorporateCohortSettingsController],
  providers: [CorporateCohortSettingsService],
  exports: [CorporateCohortSettingsService],
})
export class CreateCohortCorporateSettingsModule {} 