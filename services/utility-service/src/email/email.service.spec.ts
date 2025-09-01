import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
    let service: EmailService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string, defaultValue?: any) => {
                            const config = {
                                MAIL_HOST: 'smtp.mailtrap.io',
                                MAIL_PORT: 2525,
                                MAIL_USERNAME: '82a312b6fa9471',
                                MAIL_PASSWORD: '53269b5c09fe54',
                                MAIL_FROM_EMAIL: 'noreply@weace.com',
                                MAIL_FROM_NAME: 'WeAce Team',
                                FRONTEND_URL: 'http://localhost:3000',
                            };
                            return config[key] || defaultValue;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<EmailService>(EmailService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should have config service injected', () => {
        expect(configService).toBeDefined();
    });



    describe('sendNotificationEmail', () => {
        it('should be defined', () => {
            expect(service.sendNotificationEmail).toBeDefined();
        });
    });

    describe('sendBulkEmail', () => {
        it('should be defined', () => {
            expect(service.sendBulkEmail).toBeDefined();
        });
    });
}); 