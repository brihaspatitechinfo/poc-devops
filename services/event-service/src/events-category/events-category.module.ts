import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsCategory } from './entities/events-category.entity';
import { EventsCategoryController } from './events-category.controller';
import { EventsCategoryService } from './events-category.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventsCategory])],
    controllers: [EventsCategoryController],
    providers: [EventsCategoryService],
    exports: [EventsCategoryService],
})
export class EventsCategoryModule { } 