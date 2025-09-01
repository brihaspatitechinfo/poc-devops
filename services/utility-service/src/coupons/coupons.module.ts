import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsController } from './coupons.controller';
import { Coupon } from './coupons.entity';
import { CouponsService } from './coupons.service';

@Module({
    imports: [TypeOrmModule.forFeature([Coupon])],
    controllers: [CouponsController],
    providers: [CouponsService],
    exports: [CouponsService],
})
export class CouponsModule { } 