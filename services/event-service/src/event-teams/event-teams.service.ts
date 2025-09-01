import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateEventTeamDto } from './dto/create-event-team.dto';
import { UpdateEventTeamDto } from './dto/update-event-team.dto';
import { EventTeam } from './entities/event-team.entity';

@Injectable()
export class EventTeamsService {
    constructor(
        @InjectRepository(EventTeam)
        private eventTeamRepository: Repository<EventTeam>,
    ) { }

    async create(createEventTeamDto: CreateEventTeamDto): Promise<EventTeam> {
        try {
            const eventTeam = this.eventTeamRepository.create(createEventTeamDto);
            return await this.eventTeamRepository.save(eventTeam);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event team: ${error.message}`);
        }
    }

    async findAll(): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository.find();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event teams: ${error.message}`);
        }
    }

    async findByTeamId(teamId: number): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository.find({
                where: { teamId: teamId }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event teams by team ID: ${error.message}`);
        }
    }

    async findByTeamName(teamName: string): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository.find({
                where: { teamName: teamName }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching event teams by team name: ${error.message}`);
        }
    }

    async findOne(id: number): Promise<EventTeam> {
        try {
            const eventTeam = await this.eventTeamRepository.findOne({
                where: { id }
            });
            if (!eventTeam) {
                throw new NotFoundException(`Event team with ID ${id} not found`);
            }
            return eventTeam;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while fetching event team by ID: ${error.message}`);
        }
    }

    async update(id: number, updateEventTeamDto: UpdateEventTeamDto): Promise<EventTeam> {
        try {
            const eventTeam = await this.findOne(id);
            Object.assign(eventTeam, updateEventTeamDto);
            return await this.eventTeamRepository.save(eventTeam);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while updating event team: ${error.message}`);
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const eventTeam = await this.findOne(id);
            if (!eventTeam) {
                throw new NotFoundException(`Event team with ID ${id} not found`);
            }
            await this.eventTeamRepository.remove(eventTeam);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`An error occurred while removing event team: ${error.message}`);
        }
    }

    async bulkCreate(teams: CreateEventTeamDto[]): Promise<EventTeam[]> {
        try {
            const eventTeams = this.eventTeamRepository.create(teams);
            return await this.eventTeamRepository.save(eventTeams);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while creating event teams: ${error.message}`);
        }
    }

    async removeByTeamId(teamId: number): Promise<void> {
        try {
            await this.eventTeamRepository.delete({ teamId: teamId });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while removing event teams by team ID: ${error.message}`);
        }
    }

    async findTeamIds(): Promise<number[]> {
        try {
            const teams = await this.eventTeamRepository.find();
            return teams.map(team => team.teamId);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching team IDs: ${error.message}`);
        }
    }

    async findTeamNames(): Promise<string[]> {
        try {
            const teams = await this.eventTeamRepository.find();
            return teams.map(team => team.teamName);
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching team names: ${error.message}`);
        }
    }

    async searchByTeamName(searchTerm: string): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository
                .createQueryBuilder('team')
                .where('team.teamName LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while searching by team name: ${error.message}`);
        }
    }

    async findTeamsWithVideo(): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository.find({
                where: { videoLink: Not(IsNull()) }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching teams with video: ${error.message}`);
        }
    }

    async findTeamsWithDocument(): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository.find({
                where: { documentLink: Not(IsNull()) }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching teams with document: ${error.message}`);
        }
    }

    async findTeamsWithDisplayImage(): Promise<EventTeam[]> {
        try {
            return await this.eventTeamRepository.find({
                where: { displayImage: Not(IsNull()) }
            });
        } catch (error) {
            throw new InternalServerErrorException(`An error occurred while fetching teams with display image: ${error.message}`);
        }
    }
} 