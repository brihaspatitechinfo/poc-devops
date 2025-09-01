import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventTagMasterDto } from './dto/create-event-tag-master.dto';
import { UpdateEventTagMasterDto } from './dto/update-event-tag-master.dto';
import { EventTagMaster } from './entities/event-tag-master.entity';
import { EventTagMasterController } from './event-tag-master.controller';
import { EventTagMasterService } from './event-tag-master.service';

describe('EventTagMasterController', () => {
    let controller: EventTagMasterController;
    let service: EventTagMasterService;

    const mockEventTagMaster: EventTagMaster = {
        id: 1,
        tag: 'Technology',
        isPreferred: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByTag: jest.fn(),
        findPreferred: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        togglePreferred: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventTagMasterController],
            providers: [
                {
                    provide: EventTagMasterService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<EventTagMasterController>(EventTagMasterController);
        service = module.get<EventTagMasterService>(EventTagMasterService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event tag master', async () => {
            const createDto: CreateEventTagMasterDto = {
                tag: 'Technology',
                isPreferred: 0,
            };

            mockService.create.mockResolvedValue(mockEventTagMaster);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(mockEventTagMaster);
        });
    });

    describe('findAll', () => {
        it('should return paginated list of event tag masters', async () => {
            const mockResponse = {
                data: [mockEventTagMaster],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockService.findAll.mockResolvedValue(mockResponse);

            const result = await controller.findAll(1, 10);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });

        it('should filter by tag when provided', async () => {
            const mockResponse = {
                data: [mockEventTagMaster],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockService.findAll.mockResolvedValue(mockResponse);

            const result = await controller.findAll(1, 10, 'Tech');

            expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Tech', undefined);
            expect(result).toEqual(mockResponse);
        });

        it('should filter by isPreferred when provided', async () => {
            const mockResponse = {
                data: [mockEventTagMaster],
                total: 1,
                page: 1,
                limit: 10,
            };

            mockService.findAll.mockResolvedValue(mockResponse);

            const result = await controller.findAll(1, 10, undefined, true);

            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, true);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('findPreferred', () => {
        it('should return preferred event tag masters', async () => {
            const preferredTags = [
                { ...mockEventTagMaster, isPreferred: true },
            ];

            mockService.findPreferred.mockResolvedValue(preferredTags);

            const result = await controller.findPreferred();

            expect(service.findPreferred).toHaveBeenCalled();
            expect(result).toEqual(preferredTags);
        });
    });

    describe('findByTag', () => {
        it('should return event tag masters by tag', async () => {
            const matchingTags = [mockEventTagMaster];

            mockService.findByTag.mockResolvedValue(matchingTags);

            const result = await controller.findByTag('Tech');

            expect(service.findByTag).toHaveBeenCalledWith('Tech');
            expect(result).toEqual(matchingTags);
        });
    });

    describe('findOne', () => {
        it('should return event tag master by id', async () => {
            mockService.findOne.mockResolvedValue(mockEventTagMaster);

            const result = await controller.findOne(1);

            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockEventTagMaster);
        });
    });

    describe('update', () => {
        it('should update event tag master', async () => {
            const updateDto: UpdateEventTagMasterDto = {
                tag: 'Updated Technology',
                isPreferred: 1,
            };

            const updatedEventTagMaster = {
                ...mockEventTagMaster,
                ...updateDto,
            };

            mockService.update.mockResolvedValue(updatedEventTagMaster);

            const result = await controller.update(1, updateDto);

            expect(service.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual(updatedEventTagMaster);
        });
    });

    describe('togglePreferred', () => {
        it('should toggle preferred status', async () => {
            const toggledEventTagMaster = {
                ...mockEventTagMaster,
                isPreferred: true,
            };

            mockService.togglePreferred.mockResolvedValue(toggledEventTagMaster);

            const result = await controller.togglePreferred(1);

            expect(service.togglePreferred).toHaveBeenCalledWith(1);
            expect(result).toEqual(toggledEventTagMaster);
        });
    });

    describe('remove', () => {
        it('should remove event tag master', async () => {
            mockService.remove.mockResolvedValue(undefined);

            const result = await controller.remove(1);

            expect(service.remove).toHaveBeenCalledWith(1);
            expect(result).toBeUndefined();
        });
    });
}); 