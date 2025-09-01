import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPrice } from './entities/event-price.entity';
import { EventPricesController } from './event-prices.controller';
import { EventPricesService } from './event-prices.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventPrice])],
    controllers: [EventPricesController],
    providers: [EventPricesService],
    exports: [EventPricesService],
})
export class EventPricesModule { } 