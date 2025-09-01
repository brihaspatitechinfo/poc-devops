import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTeam } from './entities/event-team.entity';
import { EventTeamsController } from './event-teams.controller';
import { EventTeamsService } from './event-teams.service';

@Module({
    imports: [TypeOrmModule.forFeature([EventTeam])],
    controllers: [EventTeamsController],
    providers: [EventTeamsService],
    exports: [EventTeamsService],
})
export class EventTeamsModule { } 