import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponCurrencyController } from './coupon-currency.controller';
import { CouponCurrency } from './coupon-currency.entity';
import { CouponCurrencyService } from './coupon-currency.service';

@Module({
    imports: [TypeOrmModule.forFeature([CouponCurrency])],
    controllers: [CouponCurrencyController],
    providers: [CouponCurrencyService],
    exports: [CouponCurrencyService],
})
export class CouponCurrencyModule { } 