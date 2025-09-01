import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventCoupon } from './entities/event-coupon.entity';
import { EventCouponsController } from './event-coupons.controller';
import { EventCouponsService } from './event-coupons.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventCoupon])],
    controllers: [EventCouponsController],
    providers: [EventCouponsService],
    exports: [EventCouponsService],
})
export class EventCouponsModule { } 