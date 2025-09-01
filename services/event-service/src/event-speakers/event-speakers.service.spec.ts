import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateEventSpeakerDto } from './dto/create-event-speaker.dto';
import { UpdateEventSpeakerDto } from './dto/update-event-speaker.dto';
import { EventSpeaker } from './entities/event-speaker.entity';
import { EventSpeakersService } from './event-speakers.service';

describe('EventSpeakersService', () => {
    let service: EventSpeakersService;
    let repository: Repository<EventSpeaker>;

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        softRemove: jest.fn(),
        softDelete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventSpeakersService,
                {
                    provide: getRepositoryToken(EventSpeaker),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<EventSpeakersService>(EventSpeakersService);
        repository = module.get<Repository<EventSpeaker>>(getRepositoryToken(EventSpeaker));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.create(createDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createDto);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return all event speakers', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
                { id: 2, eventId: 1, name: 'Jane Smith', designation: 'CTO', linkedinProfile: null, image: null, createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByEventId', () => {
        it('should return event speakers for a specific event', async () => {
            const eventId = 1;
            const expectedResult = [
                { id: 1, eventId: eventId, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByEventId(eventId);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { eventId: eventId }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findByName', () => {
        it('should return event speakers for a specific name', async () => {
            const name = 'John Doe';
            const expectedResult = [
                { id: 1, eventId: 1, name: name, designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findByName(name);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { name: name }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('should return a single event speaker', async () => {
            const id = 1;
            const expectedResult = { id, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(expectedResult);

            const result = await service.findOne(id);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
            expect(result).toEqual(expectedResult);
        });

        it('should throw NotFoundException when event speaker not found', async () => {
            const id = 999;

            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an event speaker', async () => {
            const id = 1;
            const updateDto: UpdateEventSpeakerDto = { designation: 'CTO' };
            const existingSpeaker = { id, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };
            const expectedResult = { ...existingSpeaker, ...updateDto };

            mockRepository.findOne.mockResolvedValue(existingSpeaker);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.update(id, updateDto);

            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('remove', () => {
        it('should remove an event speaker', async () => {
            const id = 1;
            const existingSpeaker = { id, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() };

            mockRepository.findOne.mockResolvedValue(existingSpeaker);
            mockRepository.softRemove.mockResolvedValue(existingSpeaker);

            await service.remove(id);

            expect(mockRepository.softRemove).toHaveBeenCalledWith(existingSpeaker);
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

            mockRepository.create.mockReturnValue(expectedResult);
            mockRepository.save.mockResolvedValue(expectedResult);

            const result = await service.bulkCreate(speakers);

            expect(mockRepository.create).toHaveBeenCalledWith(speakers);
            expect(mockRepository.save).toHaveBeenCalledWith(expectedResult);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('removeByEventId', () => {
        it('should remove all speakers for an event', async () => {
            const eventId = 1;

            mockRepository.softDelete.mockResolvedValue({ affected: 2 });

            await service.removeByEventId(eventId);

            expect(mockRepository.softDelete).toHaveBeenCalledWith({ eventId: eventId });
        });
    });

    describe('searchByName', () => {
        it('should search speakers by name', async () => {
            const searchTerm = 'John';
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(expectedResult),
            };

            mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.searchByName(searchTerm);

            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('speaker');
            expect(mockQueryBuilder.where).toHaveBeenCalledWith('speaker.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findSpeakersWithLinkedIn', () => {
        it('should return speakers with LinkedIn profiles', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findSpeakersWithLinkedIn();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { linkedinProfile: Not(IsNull()) }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findSpeakersWithImage', () => {
        it('should return speakers with images', async () => {
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: 'CEO', linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findSpeakersWithImage();

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { image: Not(IsNull()) }
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findSpeakersByDesignation', () => {
        it('should return speakers by designation', async () => {
            const designation = 'CEO';
            const expectedResult = [
                { id: 1, eventId: 1, name: 'John Doe', designation: designation, linkedinProfile: 'https://linkedin.com/in/johndoe', image: 'https://example.com/image.jpg', createdAt: new Date(), updatedAt: new Date() },
            ];

            mockRepository.find.mockResolvedValue(expectedResult);

            const result = await service.findSpeakersByDesignation(designation);

            expect(mockRepository.find).toHaveBeenCalledWith({
                where: { designation: designation }
            });
            expect(result).toEqual(expectedResult);
        });
    });
}); 