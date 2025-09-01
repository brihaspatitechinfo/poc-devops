import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimezoneModule } from './timezone/timezone.module';
import { CurrencyModule } from './currency/currency.module';
import { LocationMasterModule } from './location-master/location-master.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { CountryModule } from './country/country.module';
import { CouponCurrencyModule } from './coupon-currency/coupon-currency.module';
import { CouponsModule } from './coupons/coupons.module';
import { CreditTransactionsModule } from './credit-transactions/credit-transactions.module';
import { EmailModule } from './email/email.module';
import { ExternalServicesModule } from './external-services/external-services.module';
import { HealthModule } from './health/health.module';
import { TimezoneMetaModule } from './timezone-meta/timezone-meta.module';
import { UploadModule } from './upload/upload.module';
import { WitOrdersModule } from './wit-orders/wit-orders.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'Admin@123',
      database: process.env.DB_NAME || 'weace_utility',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      charset: 'utf8mb4',
      timezone: 'Z',
      extra: {
        charset: 'utf8mb4_unicode_ci',
        sql_mode: 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION',
      },
      dropSchema: false,
      migrationsRun: false,
    }),
    TimezoneModule,
    TimezoneMetaModule,
    CurrencyModule,
    LocationMasterModule,
    CityModule,
    StateModule,
    CountryModule,
    HealthModule,
    CouponsModule,
    CouponCurrencyModule,
    CreditTransactionsModule,
    EmailModule,
    ExternalServicesModule,
    UploadModule,
    WitOrdersModule,
  ],
})
export class AppModule { } 