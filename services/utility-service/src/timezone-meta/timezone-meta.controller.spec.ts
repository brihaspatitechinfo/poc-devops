import { Test, TestingModule } from '@nestjs/testing';
import { TimezoneMetaController } from './timezone-meta.controller';
import { TimezoneMetaService } from './timezone-meta.service';

describe('TimezoneMetaController', () => {
    let controller: TimezoneMetaController;
    let service: TimezoneMetaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TimezoneMetaController],
            providers: [
                {
                    provide: TimezoneMetaService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findByTimezoneId: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TimezoneMetaController>(TimezoneMetaController);
        service = module.get<TimezoneMetaService>(TimezoneMetaService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
}); 