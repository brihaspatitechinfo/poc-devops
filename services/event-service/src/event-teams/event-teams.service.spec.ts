import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateEventTeamDto } from './dto/create-event-team.dto';
import { UpdateEventTeamDto } from './dto/update-event-team.dto';
import { EventTeam } from './entities/event-team.entity';
import { EventTeamsService } from './event-teams.service';

describe('EventTeamsService', () => {
    let service: EventTeamsService;
    let repository: Repository<EventTeam>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventTeamsService,
                {
                    provide: getRepositoryToken(EventTeam),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventTeamsService>(EventTeamsService);
        repository = module.get<Repository<EventTeam>>(getRepositoryToken(EventTeam));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event team', async () => {
            const createDto: CreateEventTeamDto = {
                teamId: 1,
                teamName: 'Team Alpha',
                displayImage: 'https://example.com/image.jpg',
                videoLink: 'https://example.com/video.mp4',
                documentLink: 'https://example.com/document.pdf',
                videoCaption: 'Team presentation video',
                ideaCaption: 'Innovative project idea',
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event teams', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, teamId: 2, teamName: 'Team Beta', displayImage: null, videoLink: null, documentLink: null, videoCaption: null, ideaCaption: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByTeamId', () => {
        it('should return event teams for a specific team ID', async () => {
            const teamId = 1;
            const expectedResult = [
                { id: 1, teamId: teamId, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByTeamId(teamId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { teamId: teamId }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByTeamName', () => {
        it('should return event teams for a specific team name', async () => {
            const teamName = 'Team Alpha';
            const expectedResult = [
                { id: 1, teamId: 1, teamName: teamName, displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByTeamName(teamName);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { teamName: teamName }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event team', async () => {
            const id = 1;
            const expectedResult = { id, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findOne(id);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when event team not found', async () => {
            const id = 999;

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an event team', async () => {
            const id = 1;
            const updateDto: UpdateEventTeamDto = { teamName: 'Team Alpha Updated' };
            const existingTeam = { id, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() };
            const expectedResult = { ...existingTeam, ...updateDto };

            mockRepository.findOne.mockResolvedValue(existingTeam);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.update(id, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event team', async () => {
            const id = 1;
            const existingTeam = { id, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(existingTeam);
            mockRepository.remove.mockResolvedValue(existingTeam);

            await service.remove(id);

            expect(mockRepository.remove).toHaveBeenCalledWith(existingTeam);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event teams', async () => {
            const teams: CreateEventTeamDto[] = [
                { teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image1.jpg' },
                { teamId: 2, teamName: 'Team Beta', videoLink: 'https://example.com/video2.mp4' },
            ];

            const expectedResult = [
                { id: 1, ...teams[0], videoLink: null, documentLink: null, videoCaption: null, ideaCaption: null, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, ...teams[1], displayImage: null, documentLink: null, videoCaption: null, ideaCaption: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.bulkCreate(teams);

            expect(mockRepository.create).toHaveBeenCalledWith(teams);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('removeByTeamId', () => {
        it('should remove all teams for a team ID', async () => {
            const teamId = 1;

            mockRepository.delete.mockResolvedValue({ affected: 2 });

            await service.removeByTeamId(teamId);

            expect(mockRepository.delete).toHaveBeenCalledWith({ teamId: teamId });
        });
    });

    describe('findTeamIds', () => {
        it('should return all team IDs', async () => {
            const teams = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, teamId: 2, teamName: 'Team Beta', displayImage: null, videoLink: null, documentLink: null, videoCaption: null, ideaCaption: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(teams);

            const result = await service.findTeamIds();

            expect(result).toEqual([1, 2]);
        });
    });

    describe('findTeamNames', () => {
        it('should return all team names', async () => {
            const teams = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, teamId: 2, teamName: 'Team Beta', displayImage: null, videoLink: null, documentLink: null, videoCaption: null, ideaCaption: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(teams);

            const result = await service.findTeamNames();

            expect(result).toEqual(['Team Alpha', 'Team Beta']);
        });
    });

    describe('searchByTeamName', () => {
        it('should search teams by name', async () => {
            const searchTerm = 'Alpha';
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(expectedResult),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.searchByTeamName(searchTerm);

            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('team');
            expect(mockQueryBuilder.where).toHaveBeenCalledWith('team.teamName LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamsWithVideo', () => {
        it('should return teams with video links', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findTeamsWithVideo();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { videoLink: Not(IsNull()) }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamsWithDocument', () => {
        it('should return teams with document links', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findTeamsWithDocument();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { documentLink: Not(IsNull()) }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamsWithDisplayImage', () => {
        it('should return teams with display images', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findTeamsWithDisplayImage();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { displayImage: Not(IsNull()) }
            });
            expect(result).toEqual(expectedResult);
        });
    });
}); 