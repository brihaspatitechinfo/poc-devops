import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventSpeakerDto } from './dto/create-event-speaker.dto';
import { UpdateEventSpeakerDto } from './dto/update-event-speaker.dto';
import { EventSpeakersController } from './event-speakers.controller';
import { EventSpeakersService } from './event-speakers.service';

describe('EventSpeakersController', () => {
    let controller: EventSpeakersController;
    let service: EventSpeakersService;

    const mockEventSpeakersService = {
        create: jest.fn(),
        bulkCreate: jest.fn(),
        findAll: jest.fn(),
        findByEventId: jest.fn(),
        findByName: jest.fn(),
        searchByName: jest.fn(),
        findSpeakersWithLinkedIn: jest.fn(),
        findSpeakersWithImage: jest.fn(),
        findSpeakersByDesignation: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        removeByEventId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventSpeakersController],
            providers: [
                {
                    provide: EventSpeakersService,
                    useValue: mockEventSpeakersService,
                },
            ],
        }).compile();

        controller = module.get<EventSpeakersController>(EventSpeakersController);
        service = module.get<EventSpeakersService>(EventSpeakersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event speaker', async () => {
            const createDto: CreateEventSpeakerDto = {
                eventId: 1,
                name: 'John Doe',
                designation: 'CEO',
                linkedinProfile: 'https://linkedin.com/in/johndoe',
                image: 'https://example.com/image.jpg',
            };

            const expectedResult = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date() };

            mockEventSpeakersService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('bulkCreate', () => {
        it('should create multiple event speakers', async () => {
            const speakers: CreateEventSpeakerDto[] = [
                { eventId: 1, name: 'John Doe', designation: 'CEO' },
                { eventId: 1, name: 'Jane Smith', designation: 'CTO' },
            ];

            const expectedResult = [
                { id: 1, ...speakers[0], linkedinProfile: null, image: null, createdAt: new Date(), updatedAt: new Date() },
                { id: 2, ...speakers[1], linkedinProfile: null, image: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.bulkCreate.mockResolvedValue(expectedResult);

            const result = await controller.bulkCreate(speakers);

            expect(service.bulkCreate).toHaveBeenCalledWith(speakers);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event speakers', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 1, name: 'Jane Smith', designation: 'CTO', linkedinProfile: null, image: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event speakers for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.findByEventId.mockResolvedValue(expectedResult);

            const result = await controller.findByEventId(eventId);

            expect(service.findByEventId).toHaveBeenCalledWith(eventId);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByName', () => {
        it('should return event speakers for a specific name', async () => {
            const name = 'John Doe';
            const expectedResult = [
                { id: 1, eventId: 1, name: name, designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.findByName.mockResolvedValue(expectedResult);

            const result = await controller.findByName(name);

            expect(service.findByName).toHaveBeenCalledWith(name);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('searchByName', () => {
        it('should search speakers by name', async () => {
            const searchTerm = 'John';
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.searchByName.mockResolvedValue(expectedResult);

            const result = await controller.searchByName(searchTerm);

            expect(service.searchByName).toHaveBeenCalledWith(searchTerm);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findSpeakersWithLinkedIn', () => {
        it('should return speakers with LinkedIn profiles', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.findSpeakersWithLinkedIn.mockResolvedValue(expectedResult);

            const result = await controller.findSpeakersWithLinkedIn();

            expect(service.findSpeakersWithLinkedIn).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findSpeakersWithImage', () => {
        it('should return speakers with images', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.findSpeakersWithImage.mockResolvedValue(expectedResult);

            const result = await controller.findSpeakersWithImage();

            expect(service.findSpeakersWithImage).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findSpeakersByDesignation', () => {
        it('should return speakers by designation', async () => {
            const designation = 'CEO';
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: designation, linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockEventSpeakersService.findSpeakersByDesignation.mockResolvedValue(expectedResult);

            const result = await controller.findSpeakersByDesignation(designation);

            expect(service.findSpeakersByDesignation).toHaveBeenCalledWith(designation);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event speaker', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };

            mockEventSpeakersService.findOne.mockResolvedValue(expectedResult);

            const result = await controller.findOne(id);

            expect(service.findOne).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('update', () => {
        it('should update an event speaker', async () => {
            const id = 1;
            const updateDto: UpdateEventSpeakerDto = { designation: 'CTO' };
            const expectedResult = { id, eventId: 1, name: 'John Doe', designation: 'CTO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };

            mockEventSpeakersService.update.mockResolvedValue(expectedResult);

            const result = await controller.update(id, updateDto);

            expect(service.update).toHaveBeenCalledWith(id, updateDto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event speaker', async () => {
            const id = 1;

            mockEventSpeakersService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });

    describe('removeByEventId', () => {
        it('should remove all speakers for an event', async () => {
            const eventId = 1;

            mockEventSpeakersService.removeByEventId.mockResolvedValue(undefined);

            await controller.removeByEventId(eventId);

            expect(service.removeByEventId).toHaveBeenCalledWith(eventId);
        });
    });
}); 