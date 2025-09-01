import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, UserRole, Gender } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            confirmForgotPassword: jest.fn(),
            verifyToken: jest.fn(),
            refreshTokens: jest.fn(),
            handleSsoCallback: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'raj@we-ace.com',
        password: 'SecurePass123!',
        firstName: 'Raj Kamal',
        lastName: 'Chaurasiya',
        role: UserRole.COACH,
        phone: '7503195001',
        gender: Gender.MALE,
      };

      const expectedResult = {
        userId: 'test-user-id',
        userConfirmed: false,
        message: 'User registered successfully',
      };

      jest.spyOn(service, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException when user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'raj@we-ace.com',
        password: 'SecurePass123!',
        firstName: 'Raj Kamal',
        lastName: 'Chaurasiya',
        role: UserRole.COACH,
        phone: '7503195001',
        gender: Gender.MALE,
      };

      jest.spyOn(service, 'register').mockRejectedValue(new ConflictException('Email already exists'));

      await expect(controller.register(registerDto)).rejects.toThrow('Email already exists');
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'raj@we-ace.com',
        password: 'SecurePass123!',
      };

      const expectedResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        idToken: 'mock-id-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw error when login fails', async () => {
      const loginDto: LoginDto = {
        email: 'raj@we-ace.com',
        password: 'WrongPassword123!',
      };

      jest.spyOn(service, 'login').mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
