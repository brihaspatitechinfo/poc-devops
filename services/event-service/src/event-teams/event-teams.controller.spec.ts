import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventTeamDto } from './dto/create-event-team.dto';
import { UpdateEventTeamDto } from './dto/update-event-team.dto';
import { EventTeamsController } from './event-teams.controller';
import { EventTeamsService } from './event-teams.service';

describe('EventTeamsController', () => {
    let controller: EventTeamsController;
    let service: EventTeamsService;

    const mockEventTeamsService = {
        create: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn(),
        findByTeamId: jest.fn(),
        findByTeamName: jest.fn(),
        searchByTeamName: jest.fn(),
        findTeamIds: jest.fn(),
        findTeamNames: jest.fn(),
        findTeamsWithVideo: jest.fn(),
        findTeamsWithDocument: jest.fn(),
        findTeamsWithDisplayImage: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeByTeamId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventTeamsController],
            providers: [
                {
                    provide: EventTeamsService,
                    useValue: mockEventTeamsService,
                },
            ],
        }).compile();

        controller = module.get<EventTeamsController>(EventTeamsController);
        service = module.get<EventTeamsService>(EventTeamsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
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

            mockEventTeamsService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResult);
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

            mockEventTeamsService.bulkCreate.mockResolvedValue(expectedResult);

            const result = await controller.bulkCreate(teams);

            expect(service.bulkCreate).toHaveBeenCalledWith(teams);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event teams', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, teamId: 2, teamName: 'Team Beta', displayImage: null, videoLink: null, documentLink: null, videoCaption: null, ideaCaption: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByTeamId', () => {
        it('should return event teams for a specific team ID', async () => {
            const teamId = 1;
            const expectedResult = [
                { id: 1, teamId: teamId, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.findByTeamId.mockResolvedValue(expectedResult);

            const result = await controller.findByTeamId(teamId);

            expect(service.findByTeamId).toHaveBeenCalledWith(teamId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByTeamName', () => {
        it('should return event teams for a specific team name', async () => {
            const teamName = 'Team Alpha';
            const expectedResult = [
                { id: 1, teamId: 1, teamName: teamName, displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.findByTeamName.mockResolvedValue(expectedResult);

            const result = await controller.findByTeamName(teamName);

            expect(service.findByTeamName).toHaveBeenCalledWith(teamName);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('searchByTeamName', () => {
        it('should search teams by name', async () => {
            const searchTerm = 'Alpha';
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.searchByTeamName.mockResolvedValue(expectedResult);

            const result = await controller.searchByTeamName(searchTerm);

            expect(service.searchByTeamName).toHaveBeenCalledWith(searchTerm);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamIds', () => {
        it('should return all team IDs', async () => {
            const expectedResult = [1, 2];

            mockEventTeamsService.findTeamIds.mockResolvedValue(expectedResult);

            const result = await controller.findTeamIds();

            expect(service.findTeamIds).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamNames', () => {
        it('should return all team names', async () => {
            const expectedResult = ['Team Alpha', 'Team Beta'];

            mockEventTeamsService.findTeamNames.mockResolvedValue(expectedResult);

            const result = await controller.findTeamNames();

            expect(service.findTeamNames).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamsWithVideo', () => {
        it('should return teams with video links', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.findTeamsWithVideo.mockResolvedValue(expectedResult);

            const result = await controller.findTeamsWithVideo();

            expect(service.findTeamsWithVideo).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamsWithDocument', () => {
        it('should return teams with document links', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.findTeamsWithDocument.mockResolvedValue(expectedResult);

            const result = await controller.findTeamsWithDocument();

            expect(service.findTeamsWithDocument).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findTeamsWithDisplayImage', () => {
        it('should return teams with display images', async () => {
            const expectedResult = [
                { id: 1, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventTeamsService.findTeamsWithDisplayImage.mockResolvedValue(expectedResult);

            const result = await controller.findTeamsWithDisplayImage();

            expect(service.findTeamsWithDisplayImage).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event team', async () => {
            const id = 1;
            const expectedResult = { id, teamId: 1, teamName: 'Team Alpha', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() };

            mockEventTeamsService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update an event team', async () => {
            const id = 1;
            const updateDto: UpdateEventTeamDto = { teamName: 'Team Alpha Updated' };
            const expectedResult = { id, teamId: 1, teamName: 'Team Alpha Updated', displayImage: 'https://example.com/image.jpg', videoLink: 'https://example.com/video.mp4', documentLink: 'https://example.com/document.pdf', videoCaption: 'Team presentation video', ideaCaption: 'Innovative project idea', createdAt: new Date(), updatedAt: new Date() };

            mockEventTeamsService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event team', async () => {
            const id = 1;

            mockEventTeamsService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('removeByTeamId', () => {
        it('should remove all teams for a team ID', async () => {
            const teamId = 1;

            mockEventTeamsService.removeByTeamId.mockResolvedValue(undefined);

            await controller.removeByTeamId(teamId);

            expect(service.removeByTeamId).toHaveBeenCalledWith(teamId);
        });
    });
}); 