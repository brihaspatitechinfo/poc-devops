import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    module = moduleFixture;
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have all required modules imported', () => {
    const appModule = module.get<AppModule>(AppModule);
    expect(appModule).toBeDefined();
  });
}); 