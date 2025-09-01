import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimezoneMeta } from './entities/timezone-meta.entity';
import { TimezoneMetaService } from './timezone-meta.service';

describe('TimezoneMetaService', () => {
    let service: TimezoneMetaService;
    let repository: Repository<TimezoneMeta>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TimezoneMetaService,
                {
                    provide: getRepositoryToken(TimezoneMeta),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TimezoneMetaService>(TimezoneMetaService);
        repository = module.get<Repository<TimezoneMeta>>(getRepositoryToken(TimezoneMeta));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
}); 