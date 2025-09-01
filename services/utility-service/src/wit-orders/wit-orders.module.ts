import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WitOrder } from './entities/wit-orders.entity';
import { WitOrdersController } from './wit-orders.controller';
import { WitOrdersService } from './wit-orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([WitOrder])],
    controllers: [WitOrdersController],
    providers: [WitOrdersService],
    exports: [WitOrdersService],
})
export class WitOrdersModule { } 