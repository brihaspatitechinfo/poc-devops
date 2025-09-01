import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateTimezoneMasterDto } from './dto/create-timezone-master.dto';
import { TimezoneMasterResponseDto } from './dto/timezone-master-response.dto';
import { UpdateTimezoneMasterDto } from './dto/update-timezone-master.dto';
import { TimezoneMaster } from './timezone-master.entity';
import { TimezoneService } from './timezone.service';

describe('TimezoneService', () => {
    let service: TimezoneService;
    let repository: Repository<TimezoneMaster>;
    let dataSource: DataSource;
    let queryRunner: QueryRunner;

    const mockTimezone: TimezoneMaster = {
        id: 1,
        timezoneValue: 'Asia/Kolkata',
        timezoneAbbr: 'IST',
        timezoneOffset: '+05:30',
        isdst: false,
        timezoneText: 'India Standard Time',
        timezoneMeta: [],
    };
    const mockTimezoneResponseDto: TimezoneMasterResponseDto = {
        id: 1,
        timezoneValue: 'Asia/Kolkata',
        timezoneAbbr: 'IST',
        timezoneOffset: '+05:30',
        isdst: false,
        timezoneText: 'India Standard Time',
    };
    const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
        getOne: jest.fn(),
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        count: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        },
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TimezoneService,
                {
                    provide: getRepositoryToken(TimezoneMaster),
                    useValue: mockRepository,
                },
                {
                    provide: getDataSourceToken(),
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<TimezoneService>(TimezoneService);
        repository = module.get<Repository<TimezoneMaster>>(getRepositoryToken(TimezoneMaster));
        dataSource = module.get<DataSource>(getDataSourceToken());
        queryRunner = mockQueryRunner as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all timezones', async () => {
            const mockTimezones = [mockTimezone];
            mockRepository.find.mockResolvedValue(mockTimezones);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                order: { timezoneValue: 'ASC' }
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockTimezoneResponseDto);
        });

        it('should return empty array when no timezones found', async () => {
            mockRepository.find.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockRepository.find.mockRejectedValue(new Error('Database error'));

            await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAllWithFilters', () => {
        it('should return filtered timezones by abbreviation', async () => {
            const mockTimezones = [mockTimezone];
            mockQueryBuilder.getMany.mockResolvedValue(mockTimezones);

            const filters = { abbr: 'IST' };
            const result = await service.findAllWithFilters(filters);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('timezone.timezoneAbbr = :abbr', { abbr: 'IST' });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockTimezoneResponseDto);
        });

        it('should return filtered timezones by search term', async () => {
            const mockTimezones = [mockTimezone];
            mockQueryBuilder.getMany.mockResolvedValue(mockTimezones);

            const filters = { search: 'India' };
            const result = await service.findAllWithFilters(filters);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                '(timezone.timezoneValue LIKE :search OR timezone.timezoneText LIKE :search)',
                { search: '%India%' }
            );
            expect(result).toHaveLength(1);
        });

        it('should throw BadRequestException for invalid filters', async () => {
            await expect(service.findAllWithFilters(null)).rejects.toThrow(BadRequestException);

            // Mock the queryBuilder to simulate validation behavior  
            mockQueryBuilder.getMany.mockResolvedValue([mockTimezone]);

            // Test with non-empty strings that will trigger the validation logic
            const filters1 = { abbr: '   ' }; // whitespace-only string
            await expect(service.findAllWithFilters(filters1)).rejects.toThrow(BadRequestException);

            const filters2 = { search: '   ' }; // whitespace-only string
            await expect(service.findAllWithFilters(filters2)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when no results found with filters', async () => {
            mockQueryBuilder.getMany.mockResolvedValue([]);

            const filters = { abbr: 'INVALID' };
            await expect(service.findAllWithFilters(filters)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findById', () => {
        it('should return a timezone by ID', async () => {
            mockRepository.findOne.mockResolvedValue(mockTimezone);

            const result = await service.findById(1);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockTimezoneResponseDto);
        });

        it('should throw BadRequestException for invalid ID', async () => {
            await expect(service.findById(0)).rejects.toThrow(BadRequestException);
            await expect(service.findById(-1)).rejects.toThrow(BadRequestException);
            await expect(service.findById(null as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when timezone not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findById(999)).rejects.toThrow(NotFoundException);
        });

        it('should throw InternalServerErrorException on database error', async () => {
            mockRepository.findOne.mockRejectedValue(new Error('Database error'));

            await expect(service.findById(1)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findByAbbr', () => {
        it('should return a timezone by abbreviation', async () => {
            mockRepository.findOne.mockResolvedValue(mockTimezone);

            const result = await service.findByAbbr('ist');

            expect(repository.findOne).toHaveBeenCalledWith({ where: { timezoneAbbr: 'IST' } });
            expect(result).toEqual(mockTimezoneResponseDto);
        });

        it('should throw BadRequestException for invalid abbreviation', async () => {
            await expect(service.findByAbbr('')).rejects.toThrow(BadRequestException);
            await expect(service.findByAbbr(null as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when timezone not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findByAbbr('INVALID')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getDefaultTimezone', () => {
        it('should return default timezone', async () => {
            mockRepository.findOne.mockResolvedValue(mockTimezone);

            const result = await service.getDefaultTimezone();

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockTimezoneResponseDto);
        });

        it('should throw NotFoundException when default timezone not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.getDefaultTimezone()).rejects.toThrow(NotFoundException);
        });
    });
    describe('create', () => {
        const createDto: CreateTimezoneMasterDto = {
            timezoneValue: 'Asia/Kolkata',
            timezoneAbbr: 'IST',
            timezoneOffset: '+05:30',
            isdst: false,
            timezoneText: 'India Standard Time',
        };

        it('should create a timezone successfully', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(null);
            mockQueryRunner.manager.create.mockReturnValue(mockTimezone);
            mockQueryRunner.manager.save.mockResolvedValue(mockTimezone);

            const result = await service.create(createDto);

            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.findOne).toHaveBeenCalled();
            expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(TimezoneMaster, {
                timezoneValue: 'Asia/Kolkata',
                timezoneAbbr: 'IST',
                timezoneOffset: '+05:30',
                isdst: false,
                timezoneText: 'India Standard Time',
            });
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
            expect(result).toEqual(mockTimezoneResponseDto);
        });

        it('should throw BadRequestException for invalid data', async () => {
            await expect(service.create(null as any)).rejects.toThrow(BadRequestException);
            await expect(service.create({ timezoneValue: '', timezoneAbbr: 'IST' } as any)).rejects.toThrow(BadRequestException);
            await expect(service.create({ timezoneValue: 'Asia/Kolkata', timezoneAbbr: '' } as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException for duplicate timezone', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(mockTimezone);

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(null);
            mockQueryRunner.manager.create.mockReturnValue(mockTimezone);
            mockQueryRunner.manager.save.mockRejectedValue(new Error('Database error'));

            await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        const updateDto: UpdateTimezoneMasterDto = {
            timezoneText: 'Updated India Standard Time',
        };

        it('should update a timezone successfully', async () => {
            const updatedTimezone = { ...mockTimezone, timezoneText: 'Updated India Standard Time' };
            mockQueryRunner.manager.findOne.mockResolvedValue(mockTimezone);
            mockQueryRunner.manager.save.mockResolvedValue(updatedTimezone);

            const result = await service.update(1, updateDto);

            expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(TimezoneMaster, { where: { id: 1 } });
            expect(mockQueryRunner.manager.save).toHaveBeenCalled();
            expect(result.timezoneText).toBe('Updated India Standard Time');
        });

        it('should throw BadRequestException for invalid ID', async () => {
            await expect(service.update(0, updateDto)).rejects.toThrow(BadRequestException);
            await expect(service.update(-1, updateDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when timezone not found', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(null);

            await expect(service.update(999, updateDto)).rejects.toThrow(NotFoundException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should throw ConflictException for duplicate timezone value', async () => {
            const conflictUpdateDto = { timezoneValue: 'Asia/Tokyo' };
            mockQueryRunner.manager.findOne.mockResolvedValueOnce(mockTimezone);
            mockQueryBuilder.getOne.mockResolvedValue(mockTimezone);
            mockQueryRunner.manager.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await expect(service.update(1, conflictUpdateDto)).rejects.toThrow(ConflictException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(mockTimezone);
            mockQueryRunner.manager.save.mockRejectedValue(new Error('Database error'));

            await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete a timezone successfully', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(mockTimezone);
            mockQueryRunner.manager.remove.mockResolvedValue(mockTimezone);

            await service.delete(1);

            expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(TimezoneMaster, { where: { id: 1 } });
            expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(TimezoneMaster, mockTimezone);
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should throw BadRequestException for invalid ID', async () => {
            await expect(service.delete(0)).rejects.toThrow(BadRequestException);
            await expect(service.delete(-1)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when timezone not found', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(null);

            await expect(service.delete(999)).rejects.toThrow(NotFoundException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(mockTimezone);
            mockQueryRunner.manager.remove.mockRejectedValue(new Error('Database error'));

            await expect(service.delete(1)).rejects.toThrow(BadRequestException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });
}); 