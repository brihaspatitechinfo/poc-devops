import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTagRelationship } from './entities/event-tag-relationship.entity';
import { EventTagRelationshipsController } from './event-tag-relationships.controller';
import { EventTagRelationshipsService } from './event-tag-relationships.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventTagRelationship])],
    controllers: [EventTagRelationshipsController],
    providers: [EventTagRelationshipsService],
    exports: [EventTagRelationshipsService],
})
export class EventTagRelationshipsModule { } 